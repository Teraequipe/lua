const { prefix } = require("../config.json")

const ytdl = require('ytdl-core-discord');
const ytsr = require('ytsr');

const queue = new Map();

async function playSong(message, serverQueue, songName) {

	const voiceChannel = message.member.voice.channel;

	// A confirmação sea alguém está no canal de voz está sendo feita no index
	// if (!voiceChannel) {
	// 	return message.channel.send(
	// 		'Você precisa estar em um canal de voz para eu cantar pra você ;)',
	// 	);
	// }

	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send(
			'Eu preciso de permissão para entrar e falar no canal de voz que você está!!',
		);
	}

	const songURL = await ytsr(songName)
		.then(resp => {
			return resp.items[0].link;
		})
		.catch(()=>{});

	const songInfo = await ytdl.getInfo(songURL);

	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			const connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		}
		catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}

	}
	else {
		serverQueue.songs.push(song);
		return message.channel.send(`${song.title} foi adicionada a queue!`);
	}
}

function skip(message, serverQueue) {
	if (!message.member.voice.channel) {
		return message.channel.send(
			'Você deve estar em um canal de voz para passar a música!',
		);
	}
	if (!serverQueue) {return message.channel.send('Não tem nenhuma música para ser passada!');}
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voice.channel) {
		return message.channel.send(
			'Você deve estar em um canal de voz para pausar a música!',
		);
	}
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

async function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}


	const dispatcher = serverQueue.connection
		.play(await ytdl(song.url), { type: 'opus' })
		.on('finish', () => {
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	serverQueue.textChannel.send(`Começou a tocar: **${song.title}**`);
}

module.exports = {
	name: 'play',
	aliases: ['stop', 'skip'],
	description: 'Play music',
    usage: '<play> <stop> <skip>',
    guildOnly: true,
    needsVoice: true,
	async execute(message, args) {

		const commandName = message.content.slice(prefix.length).trim().split(' ')[0];
		// const commandName = args.shift().toLowerCase();
		const songName = args.join(' ');

		const serverQueue = queue.get(message.guild.id);

		if (commandName === 'play') {
			playSong(message, serverQueue, songName);
			return;
		}
		else if (commandName === 'skip') {
			skip(message, serverQueue);
			return;
		}
		else if (commandName === 'stop') {
			stop(message, serverQueue);
			return;
		}
		else {
			message.channel.send('Você precisa passar um comando válido!');
		}

	},

};
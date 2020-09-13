const { prefix } = require('../config.json');

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

	// Verifica se o bot tem permissão para entrar e falar no canal de voz 
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send(
			'Eu preciso de permissão para entrar e falar no canal de voz que você está!!',
		);
	}

	// Usa o nome passado pelo usuário, usa o modulo ytsr para pegar o link entre as informações 
	// do vídeo usando a api do youtube sem a necessidade de executar autenticação
	const songURL = await ytsr(songName)
		.then(resp => {
			return resp.items[0];
		})
		.catch(error =>{
			console.error(error);
		});

	// Usa o link pego acima e o modulo ytdl para pegar o link entre as informações 
	// do vídeo usando a api do youtube sem a necessidade de executar autenticação
	// try {
	// 	var songInfo = await ytdl.getInfo(songURL);
		
	// } catch (error) {
	// 	message.channel.send("> Ocorreu um erro para pegar as informações no youtube. **Por favor, tente novamente**");
	// 	console.log(error);
	// }

	// Informações da música
	const song = {
		title: songURL.title + " / " + songURL.author.name,
		url: songURL.link,
		duration: songURL.duration
	};

	// Confere se ja existe uma queue na guild 
	if (!serverQueue) {
		// Cria uma queue pra guild 
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		// Associa a queue com o id da guild que solicitou o comando 
		queue.set(message.guild.id, queueContruct);

		//Adiciona a musica na lista da queue 
		queueContruct.songs.push(song);

		//Entra no canal de voz e chama a função de música
		try {
			const connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		}
		catch (err) {
			console.error(err);
			queue.delete(message.guild.id);
			return message.reply("> Ocorreu um erro para efetuar uma conexão musical. **Por favor, tente novamente**");
		}

	}
	else {
		// Adiciona a música na queue 
		serverQueue.songs.push(song);
		return message.channel.send(`> **${song.title}** foi adicionada a lista!`);
	}
}

function skip(message, serverQueue) {
	// Essa confirmação já é efetuada no index
	// if (!message.member.voice.channel) {
	// 	return message.channel.send(
	// 		'Você deve estar em um canal de voz para passar a música!',
	// 	);
	// }

	if (!serverQueue) {
		return message.reply('Não tem nenhuma música para ser passada!');
	}
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	// Essa confirmação já é efetuada no index
	// if (!message.member.voice.channel) {
	// 	return message.channel.send(
	// 		'Você deve estar em um canal de voz para pausar a música!',
	// 	);
	// }

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

	try {
		var ytdlSong = await ytdl(song.url, {
			quality: 'highestaudio',
			highWaterMark: 1 << 25
		});
		
	} catch (error) {
		console.error(err);
		return message.channel.send("> Ocorreu um erro para efetuar uma conexão no youtube. **Por favor, tente novamente**");
		
	}

	const dispatcher = serverQueue.connection
		.play(ytdlSong, { type: 'opus' })
		.on('finish', () => {
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));

	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	serverQueue.textChannel.send(`> Começou a tocar: **${song.title}**`);
}

function listSong(message, serverQueue) {
	if(serverQueue.songs){
		const songArray = serverQueue.songs.map((song, index) => {
			return (`> • **${index+1}** - **${song.title}**`);
		});

		message.channel.send(
			( 
			songArray
			));

	} else {
		message.reply("> Não tem nenhuma queue no momento.");
		
	}
	
}

module.exports = {
	name: 'play',
	aliases: ['stop', 'p', 'parar', 'skip', 'pular', 'queue','fila'],
	description: 'Play music',
	usage: '<play> <stop> <skip>',
	guildOnly: true,
	needsVoice: true,
	async execute(message, args) {
		// Corta e separa o nome do comando já que não
		// são os mesmos nome de comandos no mesmo arquivo
		const commandName = message.content.slice(prefix.length).trim().split(' ')[0];
		// const commandName = args.shift().toLowerCase();

		// Pega os argumentos que ja estão separados em um array e junta para formar o nome da musica
		const songName = args.join(' ');

		// Cria uma queue com o id da guild para fazer diferentes queues para diferentes guilds
		const serverQueue = queue.get(message.guild.id);

		// Executa os comandos de acordo com o nome do comando 
		if (commandName === 'play' || commandName === 'p') {
			playSong(message, serverQueue, songName);
			return;
		}
		else if (commandName === 'pular' || commandName === 'skip') {
			skip(message, serverQueue);
			return;
		}
		else if (commandName === 'parar' || commandName === 'stop') {
			stop(message, serverQueue);
			return;
		}
		else if (commandName === 'fila' || commandName === 'queue') {
			listSong(message, serverQueue);
			return;
		}
		else {
			message.channel.send('Você precisa passar um comando válido!');
		}

	},

};
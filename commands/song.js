const ytdl = require('ytdl-core-discord');
const ytsr = require('ytsr');

const queue = new Map();

async function playSong(message, serverQueue, songName) {

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
        "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songURL = await ytsr(songName)
            .then(resp => {
                return resp.items[0].link;
            })
            .catch(()=>{});

    const songInfo = await ytdl.getInfo(songURL);
    
    console.log("SongInfo: " + songInfo);

    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };

    console.log(song);

    if (!serverQueue) {
        const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }

    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue) {
if (!message.member.voice.channel)
    return message.channel.send(
    "You have to be in a voice channel to stop the music!"
    );
if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
if (!message.member.voice.channel)
    return message.channel.send(
    "You have to be in a voice channel to stop the music!"
    );
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
        .play(await ytdl(song.url), {type: 'opus'})
        .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

module.exports = {
    name: 'song',
    aliases: ["Song"],
	description: 'Play music',
    args: true,
    usage: '<play> <stop> <skip>',
    async execute(message, args) {
        
        const commandName = args.shift();
        const songName = args.join(' ');
        console.log(songName);

        const serverQueue = queue.get(message.guild.id);
        
        if (commandName === 'play') {
            playSong(message, serverQueue, songName);
            return;
        } else if (commandName === 'skip') {
            skip(message, serverQueue);
            return;
        } else if (commandName === 'stop') {
            stop(message, serverQueue);
            return;
        } else {
            message.channel.send("You need to enter a valid command!");
        }

    }

};
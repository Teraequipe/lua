const { prefix, wit_key, voice_prefix } = require('../config.json');
// const Discord = require('discord.js');
const fs = require('fs');
const util = require('util');
const path = require('path');
const index = require('../index');

module.exports = {
	name: 'join',
	aliases: ['leave'],
	description: 'só agradece',
	usage: '<usuario>',
	args: false,

	async execute(message) {
		// const mapKey = message.guild.id;

		const comando = message.content.slice(prefix.length).trim().split(' ');
		const commandName = comando.shift().toLowerCase();

		// console.log(commandName);
		if (!message.member.voice.channelID) {
			message.reply('Opa! Você precisa estar em um canal de voz :headphones: ');
			return;
		}

		if (commandName === 'join') {
			if (!message.guild.me.voice.channel) {
				// await message.member.voice.channel.join();
				message.reply('A Mãe tá on!');
			}
			else {
				message.reply('A Mãe já tá on!');
				return;
			}
		}
		else if(commandName === 'leave') {
			if (message.guild.me.voice.channel) {
				message.guild.me.voice.channel.leave();
				message.reply('Desconectado.');
				return;
			}
			else {
				message.reply('eu já sai zzzz.');
			}
		}
		// então ela vem pra ca
		const connection = await message.member.voice.channel.join();
		// const broadcast = connection.createBroadcast();

		// console.log(require('path'));
		await playFile(connection, require('path').join(__dirname, '../audio/ola.mp3'));
		console.log('?');

		connection.on('speaking', async (user, speaking) => {
			if (speaking) {
				// message.channel.send(`Eu estou te ouvindo ${user.username} hihi`)
				// console.log(`Eu estou te ouvindo ${user.username}`);
			}
			else {
				// message.channel.send(`Parei de te ouvir ${user.username}`)
				// console.log(`Parei de te ouvir ${user.username}`);
			}
			// cria o diretorio temporario de armazenamento
			const filename = './temp/audio_' + user.username.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_' + Date.now() + '.tmp';
			const ws = await fs.createWriteStream(filename);

			// this creates a 16-bit signed PCM, stereo 48KHz stream
			const audioStream = connection.receiver.createStream(user, { mode: 'pcm' });
			audioStream.pipe(ws);

			audioStream.on('error', (e) => {
				console.log('audioStream: ' + e);
			});
			ws.on('error', (e) => {
				console.log('ws error: ' + e);
			});

			audioStream.on('end', async () => {
				const stats = fs.statSync(filename);
				const fileSizeInBytes = stats.size;
				// duração do audio
				const duration = fileSizeInBytes / 48000 / 4;
				// console.log('duration: ' + duration);

				// filtra audios muito curtos ou muito longos

				if (duration < 1 || duration > 19) {
					// console.log(duration + 'Muito Curto / Muito Longo; Pulando');
					fs.unlinkSync(filename);
					return;
				}
				const newfilename = filename.replace('.tmp', '.raw');
				fs.rename(filename, newfilename, (err) => {
					if (err) {
						console.log('erro de rename:' + err);
						fs.unlinkSync(filename);
					}
					else{
						const infile = newfilename;
						const outfile = newfilename + '.wav';
						// converte de estereo para mono
						try {
							convert_audio(infile, outfile, async () => {
								// console.log('convertemos');
								const outRaw = await transcribe_witai(outfile);
								const out = outRaw.toLowerCase();
								console.log(out);
								if(out == '') return;
								if (!out.startsWith(voice_prefix) ) return;

								const voice_args = out.slice(voice_prefix.length).trim().split(' ');
								const voice_commandName = voice_args.shift().toLowerCase();
								console.log(voice_commandName)
								index.executeCommand(message, voice_commandName, voice_args);
								// try{
								// 	// await message.channel.send(out);
								// }
								// catch{
								// 	console.log('erro enviar mensagem');
								// }
							});
						}


						catch (e) {
							console.log('tmpraw rename: ' + e);


						}

					}
				});


			});

		});


	},
};

async function playFile(connection, filePath) {
	return new Promise((resolve, reject) => {
		const dispatcher = connection.play(filePath);
		dispatcher.setVolume(1);
		// console.log('dentro');
		dispatcher.on('start', () => {
			console.log('Playing');
		});
		dispatcher.on('finish', () => {
			console.log('end');
			resolve();
		});
		dispatcher.on('error', (error) => {
			console.error(error);
			reject(error);
		});
	});
}

// var FFmpeg = require('fluent-ffmpeg');

// function convert_audio(infile, outfile){
// 	streamin = fs.createReadStream(infile);
// 	streamout = fs.createWriteStream(outfile);
// 	var command = FFmpeg({
// 		source: streamin
// 	}).addOption('-ac', 1)
// 	.audioFrequency(16000)
// 	.saveToFile(streamout);
// }
async function convert_audio(infile, outfile, cb) {
	try {
		const SoxCommand = require('sox-audio');
		const command = SoxCommand();
		const streamin = fs.createReadStream(infile);
		const streamout = fs.createWriteStream(outfile);
		command.input(streamin)
			.inputSampleRate(48000)
			.inputEncoding('signed')
			.inputBits(16)
			.inputChannels(2)
			.inputFileType('raw')
			.output(streamout)
			.outputSampleRate(16000)
			.outputEncoding('signed')
			.outputBits(16)
			.outputChannels(1)
			.outputFileType('wav');

		command.on('end', function() {
			streamout.close();
			streamin.close();
			cb();
		});
		command.on('error', function(err, stdout, stderr) {
			console.log('Cannot process audio: ' + err.message);
			console.log('Sox Command Stdout: ', stdout);
			console.log('Sox Command Stderr: ', stderr);
		});

		command.run();
	}
	catch (e) {
		// console.log('convert_audio: ' + e);
	}
}

// conexão com o witai
let witAI_lastcallTS = null;
const witClient = require('node-witai-speech');
async function transcribe_witai(file) {
	// console.log('transcribe');
	try {
		// ensure we do not send more than one request per second
		if (witAI_lastcallTS != null) {
			let now = Math.floor(new Date());
			while (now - witAI_lastcallTS < 1000) {
				console.log('sleep');
				await sleep(100);
				now = Math.floor(new Date());
			}
		}
	}
	catch (e) {
		console.log('transcribe_witai 837:' + e);
	}

	try {
		// console.log('transcribe_witai');
		const extractSpeechIntent = util.promisify(witClient.extractSpeechIntent);
		const stream = fs.createReadStream(file);
		const output = await extractSpeechIntent(wit_key, stream, 'audio/wav');
		witAI_lastcallTS = Math.floor(new Date());
		console.log(output);
		stream.destroy();
		if (output && '_text' in output && output._text.length) {
			return output._text;
		}

		if (output && 'text' in output && output.text.length) {
			return output.text;
		}
		return output;
	}
	catch (e) {
		console.log('transcribe_witai 851:' + e);
	}
}
// ////////////////////////////////////////
// ////////////////////////////////////////
// ////////////////////////////////////////


// funções de limpar o cache
function necessary_dirs() {
	if (!fs.existsSync('./temp/')) {
		fs.mkdirSync('./temp/');
	}
	if (!fs.existsSync('./data/')) {
		fs.mkdirSync('./data/');
	}
}
necessary_dirs();


function clean_temp() {
	const dd = './temp/';
	fs.readdir(dd, (err, files) => {
		if (err) throw err;

		for (const file of files) {
			fs.unlink(path.join(dd, file), err => {
				if (err) throw err;
			});
		}
	});
}
// clean files at startup
clean_temp();

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
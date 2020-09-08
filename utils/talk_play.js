
const Say = require('say').Say;
const say = new Say('win32');
const accents = require('remove-accents');


async function talk(connection, texto) {
	const path_audio = './audio/voz.wav';
	say.export(accents.remove(texto), 'Microsoft Maria Desktop', 1.2, path_audio, async (err) => {
		if (err) {
			return console.error(err);
		}
		console.log('Text has been saved to voz.wav.');
		await playFile(connection, require('path').join(__dirname, '../audio/voz.wav'));
	});
	// Use default system voice and speed
	// say.speak(texto);

	//  say.getInstalledVoices((err, voices) => {
	// 		console.log(voices)
	//  });

}


async function playFile(connection, filePath) {
	return new Promise((resolve, reject) => {
		const dispatcher = connection.play(filePath);
		dispatcher.setVolume(1);
		// console.log('dentro');
		dispatcher.on('start', () => {
			// console.log('Playing');
		});
		dispatcher.on('finish', () => {
			// console.log('end');
			resolve();
		});
		dispatcher.on('error', (error) => {
			console.error(error);
			reject(error);
		});
	});
}

module.exports = {
    playFile: playFile,
    talk: talk
  }
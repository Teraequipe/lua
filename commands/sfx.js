const voice = require('../utils/talk_play');
const fs = require('fs');

module.exports = {
	name: 'sfx',
	aliases: ['ratinho', 'rapaz'],
	description: 'descubra o que ela vai falar pra você!',
	usage: '<list> lista os audios disponíveis\n<audio> reproduz o audio desejado',
	guildOnly:true,
	args: false,
	needsVoice: true,
	async execute(message, args) {
		const files = fs.readdirSync('./audio/sfx').filter(file => file.endsWith('.mp3'));
		const fileList = [];
		const responses = [
			'`aqui está uma lista com os meus super efeitos sonoros!!!`\n',
			'`esse é o meu patrão! tá aqui a lista!!!`\n',
			'`aproveite, rsrs`\n',
		];
		fileList.push(responses[Math.floor(Math.random() * responses.length)]);
		files.forEach(element => {
			fileList.push(element.slice(0, -4));
		});
		// console.log(fileList);
		if (args[0] === 'list') {
			message.reply(fileList);
			return;
		}
		else if( files.includes(args[0] + '.mp3') ) {
			const connection = await message.member.voice.channel.join();
			voice.playFile(connection, './audio/sfx/' + args[0] + '.mp3');
			return;
		}

		const audio = files[Math.floor(Math.random() * files.length)];

		const connection = await message.member.voice.channel.join();
		voice.playFile(connection, './audio/sfx/' + audio);


	},

};
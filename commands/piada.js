const fetch = require('node-fetch');
const lua = require('../utils/talk_play');

module.exports = {
	name: 'piada',
	aliases: ['joke'],
	description: 'piada, geralmente ruim',
	usage: '',
	args: false,

	async execute(message) {
		const file = await fetch('https://us-central1-kivson.cloudfunctions.net/charada-aleatoria',
			{
				method: 'post',
				headers: { 'Accept': 'application/json' },
			})

			.then(response => response.json());
		console.log(file);
		message.channel.send(file.pergunta);
		if (message.channel.type != 'dm') {
			const connection = await message.member.voice.channel.join();
			lua.talk(connection, file.pergunta + file.resposta);
		}


	},

};
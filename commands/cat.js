const fetch = require('node-fetch');

module.exports = {
	name: 'cat',
	aliases: ['gato', 'miau'],
	description: 'manda a foto de um gatinho',
	usage: '',
	args: false,

	async execute(message, args) {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);
	},

};
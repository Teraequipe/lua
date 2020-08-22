const fetch = require('node-fetch');

module.exports = {
	name: 'fox',
	aliases: ['raposa', 'whatdoesthefoxsay'],
	description: 'manda a foto de uma raposa',
	usage: '',
	args: false,

	async execute(message, args) {
        const { image } = await fetch('https://randomfox.ca/floof/?ref=public-apis').then(response => response.json());
        message.channel.send(image);
    }

}
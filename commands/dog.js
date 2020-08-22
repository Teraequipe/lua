const fetch = require('node-fetch');

module.exports = {
	name: 'dog',
	aliases: ['cachorro', 'auau'],
	description: 'manda a foto de um cachorro',
	usage: '',
	args: false,

	async execute(message, args) {
        const dog = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
        
        message.channel.send(dog.message);
    }

}
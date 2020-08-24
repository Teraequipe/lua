const fetch = require('node-fetch');
const Discord = require('discord.js');
const querystring = require('querystring');


const { giphy_key } = require('../config.json');
const giphy = require('giphy-api')(giphy_key);

module.exports = {
	name: 'gif',
	aliases: ['g'],
	description: 'Retorna um gif',
	usage: '<termos>',
	args: true,

	async execute(message, args) {

		// const busca = querystring.stringify({q= args.join(' ') });
		const busca = args.join(' ');

		// Search with options using callback
		giphy.search({
			q: busca,
			limit: 5,
			rating: 'g',
		}, function(err, res) {
			// console.log(res);// Res contains gif data!


			const responses = [
				`${message.author.username}, olha seu gif aqui`,
				`${message.author.username} tá na mão`,
				`${message.author.username}, vc que manda`,
				`${message.author.username}, gostasse?`,


			];

			const response = responses[Math.floor(Math.random() * responses.length)];
			try {
				message.channel.send(response + '\n' + res.data[Math.floor(Math.random() * res.data.length)].url);

			}
			catch (error) {
				console.log(error);
				message.channel.send('Não consegui carregar esse gif :(');
			}
		});

	},

};
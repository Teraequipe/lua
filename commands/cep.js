const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'cep',
	aliases: [],
	description: 'Retorna um endereço com base no cep kkkkk',
    usage: '<numeros>',
	args: true,

	async execute(message, args) {
		const busca = args[0];
		if(isNaN(busca)) {
			return error;
		}
		const pageUrl = 'https://brasilapi.com.br/api/cep/v1/';

		const cep = await fetch(pageUrl + busca).then(response => response.json());
		try{
			// console.log(cep);
			message.channel.send(cep.street + ', ' + cep.neighborhood + ', ' + cep.city + ' - ' + cep.state);
		}
		catch{
			message.channel.send('Hmmm, deu ruim');
		}

	},

};
const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');
const Discord = require('discord.js');
const querystring = require('querystring');
const { wolfram_key } = require('../config.json');

const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(wolfram_key);

module.exports = {
	name: 'wolfram',
	aliases: ['w'],
	description: 'Retorna uma busca do wolfram',
	usage: '',
	args: true,

	async execute(message, args) {

		// const busca = querystring.stringify({q= args.join(' ') });
		// const busca = querystring.stringify({ term: args.join(' ') });
		const busca = args.join(' ');

		// const pages = await fetch(`http://api.wolframalpha.com/v1/result?appid=${wolfram_api}&i=${busca}`).then(response => response.json());
		// waApi.getSimple(busca).then(console.log).catch(console.error);

		waApi.getShort(busca).then((datab) => {
			console.log((datab));
			try {

				message.channel.send(datab);
			}
			catch (error) {
				message.channel.send('Desculpa, não entendi :/');
			}
		}).catch(()=>{
			console.error;
			message.channel.send('algo deu errado :/');
		},
		);

		/*


		try {
			console.log(pages);
			const pageEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(response + '\n' + page.title)
				.setDescription(page.description)
				.setImage(page.thumbnail);

			message.channel.send(pageEmbed);


		}
		catch (error) {
			message.channel.send('algo deu errado...');
			console.log(page);


		}


        */
	},
};
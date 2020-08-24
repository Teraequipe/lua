const Discord = require('discord.js');

const wiki = require('wikijs').default;

module.exports = {
	name: 'wikipedia',
	aliases: ['pesquisa', 'search', 'busca', 'info', 'wiki'],
	description: 'Retorna uma busca do wikipédia',
	usage: '',
	args: true,

	async execute(message, args) {
		const busca = args.join(' ');
		const pageUrl = 'https://pt.wikipedia.org/w/api.php';

		try{
			const page = await wiki({ apiUrl: pageUrl }).page(busca);
			// .then( image => image.mainImage() )

			const image = await wiki({ apiUrl: pageUrl }).page(busca)
				.then(imageWiki => imageWiki.mainImage());

			const rawDescription = await wiki({ apiUrl: pageUrl }).page(busca)
				.then(pageWiki => pageWiki.summary());


			let description = rawDescription.slice(0, 700);
			description = description.slice(0, description.lastIndexOf('.') + 1);

			//console.log(page.raw.fullurl);

			const responses = [
				`${message.author.username}, sua pesquisa aqui`,
				`${message.author.username} tá na mão`,
				`${message.author.username}, vc que manda`,
				`${message.author.username}, gostasse?`,

			];

			const response = responses[Math.floor(Math.random() * responses.length)];

			try {
				const pageEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(response + '\n' + page.raw.title)
					.setImage(image)
					.setDescription(description)
					.setURL(page.raw.fullurl);
				message.channel.send(pageEmbed);
			}
			catch (error) {
				message.channel.send('algo deu errado...');
				// console.error(wiki);
			}

		}
		catch{
			message.channel.send('Não consegui encontrar o artigo...');
		}
	},

};
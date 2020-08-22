

const fetch = require('node-fetch');
const Discord = require('discord.js');
const querystring = require('querystring');

module.exports = {
    name: 'sinonimo',
	aliases: ['sinonimos', 'sn'],
	description: 'Retorna uma busca do wikipédia',
	usage: '',
	args: true,

	async execute(message, args) {

		// const busca = querystring.stringify({q= args.join(' ') });
		const busca = querystring.stringify({ term: args.join(' ') });

        
            fetch('https://www.sinonimos.com.br/orienta/')
            .then((response) => {
              return response.text();
            })
            .then((html) => {
              document.body.innerHTML = html     
            });
          
        /*
		const { pages } = await fetch(`https://www.sinonimos.com.br/orienta/`).then(response => response.json());
        console.log(pages);
		const page = pages[0];
		const responses = [
			`${message.author.username}, sua pesquisa aqui`,
			`${message.author.username} tá na mão`,
			`${message.author.username}, vc que manda`,
			`${message.author.username}, gostasse?`,

		];

		const response = responses[Math.floor(Math.random() * responses.length)];

		try {
            if(page.thumbnail != null){
                page.thumbnail = 'https:'+page.thumbnail.url;
            }
            else{
                page.thumbnail = 'https://i.imgur.com/lBalNu8.png';
            }
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
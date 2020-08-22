const fetch = require('node-fetch');
const Discord = require('discord.js');
module.exports = {
	name: 'marte',
	aliases: ['nasa', 'mars', 'rover', 'curiosity'],
	description: 'Manda uma foto de Marte :)',
	usage: '',
	args: false,

	async execute(message, args) {
		const {photos} = await fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY').then(response => response.json());

        const responses = [
            `${message.author.username}, olha sua foto de marte`,
            `${message.author.username} tá na mão`,
            `${message.author.username}, marte é incrível né?`,
            `${message.author.username}, gostasse?`,

        ];

        const response = responses[Math.floor(Math.random() * responses.length)];

		try {
			const foto = photos[Math.round(Math.random() * 800)];
            console.log(foto.rover.landing_date)
			const fotoEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(response)
                .setImage(foto.img_src)
                .setFooter(foto.rover.landing_date + ' Tirado pelo meu amigo: ' + foto.rover.name);
			message.channel.send(fotoEmbed);


		}
		catch (error) {
                message.channel.send(photos[Math.round(Math.random() * 800)].img_src)
                console.log( photos[Math.round(Math.random() * 800)] );

                
		}


	},

};
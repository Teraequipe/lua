const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'elefante',
	aliases: ['elephant', 'dumbo'],
	description: 'manda info de um elefante',
	usage: '',
	args: false,

	async execute(message, args) {
		const elefantes = await fetch('https://elephant-api.herokuapp.com/elephants').then(response => response.json())


			
				try {
					const elefante = elefantes[Math.round(Math.random()*45)];

					const elefanteEmbed = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.setTitle('Nome: ' + elefante.name)
						.setURL(elefante.wikilink)
						.setDescription(elefante.affiliation)
						.setThumbnail(elefante.image)
						.addFields(
							{ name: 'Informações:', value: elefante.note },
						)

						.setImage(elefante.image);
					message.channel.send(elefanteEmbed);


					

				}
				catch (error) {
                    
				}


			


	},

};
module.exports = {
	name: 'vaitecata',
	aliases: ['vtnc', 'vsf'],
	description: 'vaitecata',
	usage: '<usuario>',
	args: true,

	execute(message, args) {
        nome = args[0];
        if (nome === '<@745682565725421888>'){
            message.channel.send('Vai você mano');
        }
		else if(message.mentions.users.first()) {
			//message.channel.send(`${message.author.username} mandou ${nome} ir catar coquinho`);
			const responses = [
				`${message.author.username} mandou ${nome} ir catar coquinho`,
				`${message.author.username} gostaria de pedir para ${nome} caçar o que fazer`,
				`${message.author.username} pediu pra eu falar muuuuuuu para ${nome} entender`,
				`${nome} 5 minutos de briga sem perder a amizade com ${message.author.username}, topa?`,
			];

			response = responses[Math.floor(Math.random() * responses.length)];

			message.channel.send(response);
		}
		else{
			message.channel.send('Você precisa marcar alguém...');
		}
	},
};
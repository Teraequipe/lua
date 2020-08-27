module.exports = {
	name: 'vlw',
	aliases: ['obrigado', 'tmj', 'valeu'],
	description: 'só agradece',
	usage: '<usuario>',
	args: true,

	execute(message, args) {
		nome = args[0];
		if (nome === '<@745682565725421888>') { // endereço dela
			message.channel.send('Awnnnnn!! <3');
		}
		else if(message.mentions.users.first()) {
			//	message.channel.send(`${message.author.username} mandou ${nome} ir catar coquinho`);
			const responses = [
				`${message.author.username} mandou um valeu pra você ${nome}`,
				`satisfação, ${nome}`,
				`valeuuuuuu ${nome}`,
				`valeeu ${nome}`,
				`obrigadíssimo ${nome}`,
			];

			const response = responses[Math.floor(Math.random() * responses.length)];
			console.log(message)
			message.delete({timeout: 10});
			message.channel.send(response);
			//message.channel.delete(1);
		}
		else{
			message.channel.send('Você precisa marcar alguém...');
		}
	},
};
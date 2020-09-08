module.exports = {
	name: 'oi',
	description: 'Olá!',
	usage: '<user> <role>',
	args: false,
	execute(message) {
		message.channel.send(`Oi ${message.author}`);
		// message.channel.send(`/tts oi!`);
	},
};
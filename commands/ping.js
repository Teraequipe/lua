module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: true,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};
module.exports = {
	name: 'abraço',
    description: 'mandar abraço',
    aliases: ['mandaabraço'],
    usage: '<user> <role>',
    args: true,
    
	execute(message, args) {
        nome = args[0]
		message.channel.send(`${message.author.username} mandou um abraço pra você, ${nome}`);
	},
};
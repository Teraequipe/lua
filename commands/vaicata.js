module.exports = {
    name: 'vaitecata',
    aliases: ['vtnc', 'vsf'],
	description: 'vaitecata',
	usage: '<user> <role>',
	args: true,

	execute(message, args) {
		nome = args[0];
		if(message.mentions.users.first()) {
			message.channel.send(`${message.author.username} mandou ${nome} ir catar coquinho`);
		}
		else{
			
		}
	},
};
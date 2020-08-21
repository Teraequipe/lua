module.exports = {
	name: 'd20',
    description: 'rola um d20',
    usage: '<user> <role>',
    args: false,
    cooldown: 5,
	execute(message, args) {
        valor = parseInt(20*Math.random()+1);
		message.channel.send(`${message.author.username} tirou ${valor} no d20`);
	},
};
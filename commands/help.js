const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'Lista de todos os meus comandos!.',
	aliases: ['commands','comandos','ajuda'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
            
			data.push('Aqui está uma lista de todos os meus comandos:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nVocê pode enviar \`${prefix}help [nome do comando]\` para mais informações!`);
            
			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Te mandei uma DM com os meus comandos :smirk: ');
				})
				.catch(error => {
					console.error(`Não consegui te enviar por DM :( ${message.author.tag}.\n`, error);
					message.reply('Não consegui te enviar por DM :( A sua DM está aberta?');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('Esse não é um comando válido!');
		}
        data.push(`\``);
		data.push(`**Nome:** ${command.name}`);

		if (command.aliases) data.push(`**Sinônimos:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Descrição:** ${command.description}`);
		if (command.usage) data.push(`**Uso:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
        data.push(`\``);
		message.channel.send(data, { split: true });


	},
};
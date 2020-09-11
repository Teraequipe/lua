const Keyv = require('keyv');

const prefixes = new Keyv('sqlite://database.sqlite', { namespace: 'prefixes' });

module.exports = {
	name: 'prefix',
	aliases: ['novoprefix', 'newpref', 'prefixo', 'prefix'],
	description: 'Muda o prefixo dos comandos da lua.',
    usage: `<novo prefixo>`,
    guildOnly: true,
    args:  true,
    async execute(message, args){

        if (message.member.hasPermission('ADMINISTRATOR')) {
            await prefixes.set(message.guild.id, args[0]);
            return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
        
        } else {
            message.reply('> Você não tem autorização para mudar o meu prefixo. Somente, quem possui a permissão de administrador pode fazer isso.')
        }
    


    }
}
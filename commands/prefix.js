const { prefix } = require('../config.json');
const fs = require('fs');

module.exports = {
	name: 'prefix',
	aliases: ['novoprefix', 'newpref', 'prefixo', 'prefix'],
	description: 'Muda o prefixo dos comandos da lua.',
    usage: `<novo prefixo>`,
    guildOnly: true,
    args:  true,
    execute(message, args){
        let newPrefix = args[0];

        fs.readFile('./config.json', (err, data) => {
            if (err) {
                console.error(err);
                message.reply('Ocorreu um erro. Tente novamente!!!');
            }

            let configFile = JSON.parse(data.toString());

            configFile.prefix = newPrefix;

            configFile = JSON.stringify(configFile);
            
            fs.writeFileSync('./config.json', configFile);

            message.channel.send('O prefixo foi alterado com sucesso.')
        });


    }
}
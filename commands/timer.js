const { prefix } = require('../config.json');

var timers = new Map();

function newTimer(message, sec){
    
    if (!timers.get(message.author.id)) {
        message.reply(`Seu temporizador foi setado.`);
        let timer = setTimeout(() => {
            message.reply('O tempo acabou!!!');
            timers.delete(message.author.id)
        }, sec*1000);
        
        let construct = {
            timer,
            user_id: message.author.id,
            start: Date.now(),
            finish: (Date.now() + sec*1000),
        }

        timers.set(message.author.id, construct);
        
    } else {
        message.reply('Você já tem um temporizador rodando.');
    }


}

function stopTimer(message){

    if (timers.get(message.author.id)) {
        clearInterval(timers.get(message.author.id).timer);
        timers.delete(message.author.id);
        message.reply("Seu temporizador foi deletado!!!");
    
    } else {
        message.reply('Você não tem um temporizador rodando.');
    }

}

function myTimer(message){
    if (timers.get(message.author.id)) {
        let timer = timers.get(message.author.id);
        console.log(timer);
        console.log(timer.finish);
        console.log(Date.now());
        console.log(timer.finish - Date.now());
        message.reply(`Falta ${parseInt((timer.finish - Date.now())/1000 )} segundos.`);
    
    } else {
        message.reply('Você não tem um temporizador rodando.');
    }
}

module.exports = {
	name: 'temporizador',
	aliases: ['novotemp', 'newtimer', 'parartemp', 'stoptimer', 'meutemp', 'mytimer'],
	description: 'Começa, pausa e mostra um temporizador unico por usuário.',
    usage: `${prefix}novotemp <tempo em segundos> ou ${prefix}newtimer <tempo em segundos>
            ${prefix}parartemp ou ${prefix}stoptimer 
            ${prefix}meutemp ou ${prefix}mytimer `,
    guildOnly: true,
    async execute(message, args) {
		// Corta e separa o nome do comando já que não
		// são os mesmos nome de comandos no mesmo arquivo
		const commandName = message.content.slice(prefix.length).trim().split(' ')[0];
        
        const sec = args[0];


        console.log(sec);
    
        // Executa os comandos de acordo com o nome do comando 
		if (commandName === 'novotemp' || commandName === 'newtimer') {
			newTimer(message, sec);
			return;
		}
		else if (commandName === 'parartemp' || commandName === 'stoptimer') {
			stopTimer(message);
			return;
		}
		else if (commandName === 'meutemp' || commandName === 'mytimer') {
			myTimer(message);
			return;
		}
		else {
			message.channel.send('Você precisa passar um comando válido!');
		}

    }

}
    

const mention = require('../utils/mention.js');

module.exports = {
	name: 'mover',
	aliases: ['move'],
	description: 'Comando relacionado a mover pessias entre canais de canais.',
    usage: `<nome da pessoa> <canal>`,
    guildOnly: true,
    args:  true,
    execute(message, args){

        const voiceChannel = message.member.voice.channel;
        const voiceChannels = message.channel.guild.channels
        const vChannelName = args[1];
        const personMentionedID = mention(args[0]);

        voiceChannels.cache.map(channel => {
            if(channel.type === 'voice' && channel.name == vChannelName){
                
                if (message.member.hasPermission('MOVE_MEMBERS') && voiceChannel) {
                    message.guild.members
                        .fetch(`${personMentionedID}`)
                            .then( persoa => persoa.voice.setChannel(channel.id))
                    
                
                } else {
                    return message.reply('você não tem permissão para mudar alguém de canal');
                }
                
            }
        });


    }
}
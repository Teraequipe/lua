module.exports = {
	name: 'mover',
	aliases: ['mover', 'move'],
	description: 'Comando relacionado a mover pessias entre canais de canais.',
    usage: `<nome da pessoa> <canal>`,
    guildOnly: true,
    args:  true,
    execute(message, args){

        const voiceChannel = message.member.voice.channel;
        const voiceChannels = message.channel.guild.channels
        const vChannelName = args[0];

        console.log(voiceChannel);
        console.log(voiceChannels.find(u => u.name === 'vChannelName'));

        if (message.member.hasPermission('MOVE_MEMBERS') && voiceChannel) {


            
            message.member.voice.setChannel();
        } else {
            message.reply('você não tem permissão para mudar alguém de canal');
        }
    }
}
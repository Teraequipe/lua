module.exports = {
	name: 'unmute',
	aliases: ['desmutar', 'um'],
	description: 'muta geral',
	usage: '<usuário> ou <all>',
	guildOnly:true,
	args: false,
	needsVoice: true,

	async execute(message, args) {

		if (!message.member.hasPermission('MUTE_MEMBERS')) {
			message.channel.send('uepa! você não tem permissão pra isso não...');
			return;
		}
		nome = message.mentions.users.first();
		if(args[0] === 'all' || !args[0] ) {
			let channel = message.member.voice.channel;
			for (let member of channel.members) {
				await member[1].voice.setMute(false);
			}
			// setTimeout(() => {
			// 	for (let member of channel.members) {
			// 		member[1].voice.setMute(false);
			// 	}
			// }, 10 * 1000);
		}
		else if(message.mentions.users.first()) {
			const member = message.guild.members.cache.find(member => member.id === nome.id); 
			console.log(nome);
			member.voice.setMute(false);
		}
		else{
			message.channel.send('você precisa marcar alguem');
			return;
		}

		// let channel = message.member.voice.channel;
		// for (let member of channel.members) {
		// 	// console.log(member[1]);
		// 	// await member[1].roles.add(mute_role);
		// 	await member[1].voice.setMute(true);
		// }
		// setTimeout(() => {
		// 	for (let member of channel.members) {
		// 		member[1].voice.setMute(false);
		// 	}
		// }, 10 * 1000);

	},

};
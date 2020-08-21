// require the discord.js module
const Discord = require('discord.js');

// require config.json credenciais
const { prefix, token } = require('./config.json');
// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// login to Discord with your app's token
client.login(token);


client.on('message', message => {
	console.log(message.content);

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	// oi lua
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (message.content === `${prefix}ping`) {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}
	if (command === 'oi') {
		// if (message.author.username === 'LAB') {
		// 	message.channel.send('Parabens corno!');
		// }else{
		message.channel.send(`Oi ${message.author.username}`);
		// }
	}

	if (command === 'kick') {
		// grab the "first" mentioned user from the message
		// this will return a `User` object, just like `message.author`
		const taggedUser = message.mentions.users.first();

		message.channel.send(`Você quis expulsar ${taggedUser.username}`);
	}
	if (command === 'avatar') {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: true })}>`;
		});

		// send the entire array of strings as a message
		// by default, discord.js will `.join()` the array with `\n`
		message.channel.send(avatarList);
	}
	// message.channel.send(`Command name: ${command}\nArguments: ${args}`);
});

// require filesystem
const fs = require('fs');

const Keyv = require('keyv');
const prefixes = new Keyv('sqlite://database.sqlite', { namespace: 'prefixes' });
prefixes.on('error', err => console.error('Connection Error', err));

// require the discord.js module
const Discord = require('discord.js');

module.exports = {
	executeCommand: executeCommand,
};

// require config.json credenciais
const { originalPrefix, token } = require('./config.json');
// create a new Discord client
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// use cooldowns
const cooldowns = new Discord.Collection();


client.once('ready', () => {
	console.log('Pronta para a ação!');
});

// login to Discord with your app's token
client.login(token);


client.on('message', async message => {
	var prefix;

	const guildId = await message.channel.guild.id;

	const guildPrefix = await prefixes.get(guildId);

	if (guildPrefix === undefined) {
		prefix = originalPrefix;
	} else {
		prefix = guildPrefix;
	}

	if (!message.content.startsWith(prefix) || message.author.bot ) return;


	const args = message.content.slice(prefix.length).trim().split(' ');
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`Espere mais ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando \`${command.name}\` novamente.`);
			}
		}

	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


	executeCommand(message, commandName, args);
});

function executeCommand(message, commandName, args) {
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('Ueeepa! esse comando é somente para servidores!');
	}

	if (command.needsVoice && !message.member.voice.channelID) {
		message.reply('Opa! Você precisa estar em um canal de voz :headphones: ');
		return;
	}

	if (command.args && !args.length) {
		let reply = `Hmm, você precisa me dizer mais argumentos, ${message.author}!   :no_mouth: `;

		if (command.usage) {
			reply += `\nEntão, o uso correto seria: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('Hmmm, não identifiquei o seu comando :sad:!');
	}
}


client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'geral');
	if (!channel) return;

	const responses = [
		`Olá, ${member}! A casa é sua :blush:  `,
	];

	const response = responses[Math.floor(Math.random() * responses.length)];
	const welcome = `\n\nMeu nome é *Lua!* Estou aqui para te auxiliar, você pode falar comigo utilizando o prefixo *${prefix}*.\nAproveite!`;
	channel.send(response + welcome);
});


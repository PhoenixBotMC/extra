const Command = require('../../../Structure/Command');
const { sendCustomMessage } = require('../../../utils/MessageUtils');

module.exports = class extends Command {
    constructor(client) {
		super(client, 'ping', {
			aliases: ['p'],
			description: 'Shows the ping of the bot',
			category: 'Utilities',
			usage: '%pping',
			requiredPerms: []
		});
	}
    async run (message, _args, client) {
        const msg = await message.channel.send("Pinging...");

        const latency = msg.createdTimestamp - message.createdTimestamp;
        const choices = ['Did bananas push to production... again? :unamused:', 'We all know its you, not the bot, :confused:', 'Why are you checking this, our bot works perfectly, YOU are the issue! :innocent:',
    'The Phoenix Devs are perfect, there is no reason to run this command :rolling_eyes:'];
        let response = choices[Math.floor(Math.random() * choices.length)];

        await msg.delete();
        sendCustomMessage(message.channel, "PURPLE", `${response} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(client.ws.ping)}ms\``, 'Ping');
    }
}
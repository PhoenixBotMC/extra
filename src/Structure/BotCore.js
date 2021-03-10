const { Client, Collection } = require("discord.js");
const { sendErrorMessage } = require("../utils/MessageUtils");
const Util = require("../utils/Util");
const path = require("path");
const GuildData = require("../Schemas/GuildData");
const PremiumLinkData = require("../Schemas/PremiumLinkData");

const RoleSync = require("../RoleSync/RoleSync"); 

class BotCore extends Client {
    constructor(bot, options = {}) {
        super({
            disableMentions: 'everyone'
        });

        this.validate(options);

        this.commands = new Collection();

        this.aliases = new Collection();

        this.Bot = bot;

        this.defaultPrefix = options.defaultPrefix || "!"; 

        this.on('guildCreate', this.registerGuild);

        this.on('guildMemberAdd', this.syncGuildMember); 

        this.once('ready', () => {
            console.log(`Logged in as ${this.user.username}!`);
        });

        this.on('message', async (message) => {

            let prefix = this.getPrefix(message.guild);

            if (!message.guild || message.author.bot) return;

            if (!message.content.startsWith(prefix)) return;

            //eslint-disable-next-line no-unused-vars
            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()));

            if (command) {
                if (command.requiredPerms) {
                    let isAllowed = true;
                    command.requiredPerms.forEach((perm) => {
                        if (!message.member.hasPermission(perm)) isAllowed = false;
                    });
                    if (!isAllowed) return sendErrorMessage(message.channel, "You are not a high enough role to use this.");
                }
                // noinspection ES6MissingAwait
                command.run(message, args, this);
            }
        })
    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options must be type of object');

        if (!options.token) throw new Error('You must provide a token for the client');
        this.token = options.token;
    }

    async start(token = this.token) {
        await Util.loadCommands(this, `Commands${path.sep}CoreCommands`);
        await Util.loadCommands(this, `Commands${path.sep}Hypixel`);
        await Util.loadCommands(this, `Commands`);
        await super.login(token);
    }

    getPrefix(guild) {
        return this.Bot.GuildManager.getGuild(guild.id)?.data.Prefix || this.Bot.GuildManager.getGuild(guild)?.data.Prefix || "!";
    }

    async registerGuild(guild) {
        if (await GuildData.Model.exists({ServerID: guild.id})) return;
        let doc = GuildData.createDefault(guild.id, this.defaultPrefix);
        doc.save();

        this.Bot.GuildManager.addGuild(doc);


        if (await PremiumLinkData.Model.exists({ServerID: guild.id})) {
            this.Bot.GuildManager.getGuild(guild.id).premium = true;
        }
    }

    parsePrefix(guildID, text) {
        return text.replace(/%p/g, this.getPrefix(guildID)); 
    }

    async syncGuildMember(member) {
        const d = await this.Bot.LinkManager.getDataByDiscord(member.id);  
        if (d) {
            RoleSync(member, d.MinecraftUUID, this.Bot.GuildManager.getGuild(member.guild.id)?.data.RoleLinks); 
        }
    }
}


module.exports = BotCore;
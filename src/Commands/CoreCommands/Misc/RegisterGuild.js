const Command = require("../../../Structure/Command");
const GuildData = require("../../../Schemas/GuildData");
const PremiumLinkData = require("../../../Schemas/PremiumLinkData");

class RegisterGuild extends Command {
    constructor(client) {
        super(client, "registerguild", {
            aliases: [],
            description: "Registers guild in db",
            category: "Misc",
            usage: `%pRegisterGuild`,
            requiredPerms: []
        });
    }

    async run(message, args, client) {

        if (await GuildData.Model.exists({ServerID: message.guild.id})) return message.reply("Guild already exists in database. ");
        let doc = GuildData.createDefault(message.guild.id);
        doc.save();

        client.Bot.GuildManager.addGuild(doc);

        message.reply("Registered Guild!");

        if (await PremiumLinkData.Model.exists({ServerID: message.guild.id})) {
            (await client.Bot.GuildManager.getGuild(message.guild.id)).premium = true;
            message.reply("This guild is Premium!");
        } else {
            message.reply("This guild is not premium. Consider buying premium as it will unlock many more features which are very useful towards your guild. For more info, visit phoenix.dev/premium!")
        }
    }
}

module.exports = RegisterGuild;
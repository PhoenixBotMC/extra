let { MessageEmbed } = require("discord.js");

class Utils {
    static sendErrorMessage(channel, error) {
        let embed = new MessageEmbed();

        embed
            .setColor("RED")
            .setTitle('Error')
            .setDescription(error);
        channel.send(embed);
    }

    static sendSuccessMessage(channel, message) {
        let embed = new MessageEmbed();

        embed
            .setColor("GREEN")
            .setTitle("Success!")
            .setDescription(message);
        channel.send(embed);
    }

    static sendCustomMessage(channel, color, message, ...sections) {
        let embed = new MessageEmbed()

        embed
            .setColor(color)
            .setDescription(message)
            .setFooter("Phoenix Bot coded by Project Phoenix")
            .setImage('');
        if(!sections.size == 0
        || !sections == null) {
            for (let i = 0; (i < sections -1); i =+ 2) {
                embed.addField(sections[i], sections[(i+1)]);
            }
        }
        channel.send(embed);
    }
}

module.exports = Utils;
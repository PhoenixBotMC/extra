const BotCore = require("./Structure/BotCore");
const GuildManager = require("./Structure/GuildManager");
const DatabaseHandler = require("./handlers/DatabaseHandler");

class Bot {
    constructor() {
        Bot.bot = this; 
        this.CoreBot = new BotCore(this, {
            token: process.env.BOT_TOKEN, 
            defaultPrefix: "!"
        });
        this.GuildManager = new GuildManager(this);
        this.DatabaseHandler = new DatabaseHandler(process.env.DB_URI, {}, async () => {
            console.log("Database is connected. ");
            console.log("Loading guilds...");
            await this.GuildManager.loadGuilds();
        });

        this.slothpixel = require("phoenix-slothpixel");

        this.CoreBot.start();
    }

    static getBot() {
        return this.bot; 
    }
}

module.exports = Bot;
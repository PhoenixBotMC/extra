import BotCore from "./Structure/BotCore"
import GuildManager from "./Structure/GuildManager";
import DatabaseHandler from "./handlers/DatabaseHandler";
import LinkManager from "./Structure/LinkManager"; 
import UUIDManager from "./Structure/UUIDManager"; 
import Server from "./express/Server";

export default class Bot {
  static bot: Bot;
  CoreBot: BotCore;
  LinkManager: LinkManager;
  GuildManager: GuildManager;
  UUIDManager: UUIDManager;
  WebServer: Server;
  DatabaseHandler: DatabaseHandler;
    constructor() {
        Bot.bot = this; 
        this.CoreBot = new BotCore(this, {
            token: process.env.BOT_TOKEN, 
            defaultPrefix: "!"
        });
        this.LinkManager = new LinkManager(/*this*/); 
        this.GuildManager = new GuildManager(this);
        this.UUIDManager = new UUIDManager(/*this*/); 
        this.WebServer = new Server(this, 4000); 
        this.DatabaseHandler = new DatabaseHandler(process.env.DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }, () => {
            console.log("Database is connected.");
        });
        this.CoreBot.start();
        // Commented for now, need to test if it works without mineflayer attached
        // this.MineflayerManager = new MineflayerManager(this.CoreBot.guilds.cache);
    }
  static getBot() {
    return this.bot; 
  }
}
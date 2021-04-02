import Guild from "./Guild";
import GuildData, { createDefault } from "../Schemas/GuildData";
import PremiumLinkData from "../Schemas/PremiumLinkData";

export default class GuildManager {
  guilds: any[];
  bot: any;
  constructor(bot) {
    // holds guild data for guilds
    this.guilds = [];
    this.bot = bot;
  }

  async loadGuilds() {
    const all = await GuildData.find();

    for (let guild of all) {
      let g = this.addGuild(guild);

      if (await this.isPremium(guild.ServerID)) g.premium = true;
    }
  }

  unloadGuilds() {
    this.guilds = [];
  }

  async isPremium(guildID) {
    return await PremiumLinkData.exists({ ServerID: guildID });
  }

  addGuild(doc, isPremium = false) {
    let guild = new Guild(doc, isPremium);
    this.guilds.push(guild);
    return guild;
  }

  async getGuild(guildID) {
    const foundGuild = this._getGuildFromCache(guildID);
    if (foundGuild) return foundGuild;

    const guild = await GuildData.findOne({ ServerID: guildID });
    if (guild) {
      this.addGuild(guild, await this.isPremium(guildID));
      return this._getGuildFromCache(guildID);
    }
  }

  _getGuildFromCache(guildID) {
    return this.guilds.find((guild) => guild.id === guildID);
  }

  async updateGuild(guildID) {
    const guildData = await GuildData.find({ ServerID: guildID });
    let guild = await this.getGuild(guildID);
    if (!guild) return;

    guild.data = guildData;
    if (await PremiumLinkData.exists({ ServerID: guild.ServerID })) {
      guild.premium = true;
      return;
    }
    guild.premium = false;
  }

  editKey(guildID, key, value) {
    let guild = this.getGuild(guildID);
    if (!guild) return;
    // wtf even is this
  }
}

module.exports = GuildManager;

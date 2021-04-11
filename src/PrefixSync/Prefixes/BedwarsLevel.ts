import { Player } from "../../SlothpixelAPITypes/Player";
import Prefix from "../Prefix";

class BedwarsLevel extends Prefix<String> {
  constructor() {
    super({
      DefaultName: "Bedwars Level",
      id: "BEDWARS_LEVEL",
    });
  }

  run(player: Player) {
    return player.stats.BedWars.level || "0";
  }
}

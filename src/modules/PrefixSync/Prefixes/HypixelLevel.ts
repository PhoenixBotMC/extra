import Player from "phoenix-slothpixel/Player";
import Prefix from "../Prefix";

class HypixelLevel extends Prefix<String> {
    constructor() {
        super({
            DefaultName: 'Hypixel Level',
            id: 'HYPIXEL_LEVEL'
        })
    }

    run(player: Player): String {
        return Math.floor(player.level).toString();
    }
}

module.exports = HypixelLevel
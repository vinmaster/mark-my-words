import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') id: string;
  @type('string') name: string;
}

export class LobbyState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();

  updatePlayer(id: string, fn: (player: Player) => void) {
    let player = this.players.get(id);
    fn(player);
    this.players.set(id, player);
  }
}

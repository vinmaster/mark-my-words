import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') id: string;
  @type('string') name: string;
  @type('number') points: number = 0;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type('string') currentPhrase: string = '';

  updatePlayer(id: string, fn: (player: Player) => void) {
    let player = this.players.get(id);
    fn(player);
    this.players.set(id, player);
  }
}

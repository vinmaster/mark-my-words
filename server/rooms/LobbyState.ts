import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') id: string;
  @type('string') name: string;
}

export class LobbyState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

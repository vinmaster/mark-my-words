import { Room, Client, matchMaker } from 'colyseus';
import { GameState, Player } from './GameState';

export class GameRoom extends Room<GameState> {
  intervalId?: number;

  onCreate(options: any) {
    this.autoDispose = false;
    console.log('GameRoom created');
    this.setState(new GameState());

    this.onMessage('setRoomId', async (client, roomId: string) => {
      this.roomId = roomId;
    });

    this.onMessage('message', (client, message) => {
      this.broadcast('message', { ...message, id: client.sessionId });
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');
    let player = new Player();
    player.id = client.sessionId;
    player.name = options.name || client.sessionId;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
    }
    if (this.clients.length === 0) {
      this.disconnect();
    }
  }

  onDispose() {
    console.log('GameRoom', this.roomId, 'disposing...');
  }
}

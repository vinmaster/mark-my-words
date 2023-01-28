import { Room, Client, matchMaker } from 'colyseus';
import { LobbyState, Player } from './LobbyState';

export class LobbyRoom extends Room<LobbyState> {
  onCreate(options: any) {
    this.setState(new LobbyState());

    this.onMessage('editName', (client, newName: string) => {
      this.state.updatePlayer(client.sessionId, player => (player.name = newName));
    });

    this.onMessage('listRooms', async client => {
      client.send('listRooms', await matchMaker.query({ name: 'GameRoom' }));
    });

    this.onMessage('createRoom', async client => {
      let room = await matchMaker.createRoom('GameRoom', {});
      client.send('roomCreated', { roomId: room.roomId, name: room.name });
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
  }

  onDispose() {
    console.log('LobbyRoom', this.roomId, 'disposing...');
  }
}

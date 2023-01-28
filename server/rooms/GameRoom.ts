import fs from 'fs/promises';
import path from 'path';
import { Room, Client, matchMaker } from 'colyseus';
import { GameState, Player } from './GameState';

export class GameRoom extends Room<GameState> {
  timer?: number;
  phrases: string[];

  onCreate(options: any) {
    this.autoDispose = false;
    this.clock.start();

    fs.readFile(path.resolve(__dirname, '../public/cliches.txt'), { encoding: 'utf8' }).then(
      file => {
        this.phrases = this.parsePhrases(file);
        this.state.currentPhrase = this.getNextPhrase();
      }
    );

    this.setState(new GameState());
    console.log('GameRoom created', this.state.currentPhrase);

    this.onMessage('setRoomId', async (client, roomId: string) => {
      this.roomId = roomId;
    });

    this.onMessage('message', (client, message) => {
      if (this.cleanPhrase(message.text) === this.state.currentPhrase) {
        this.state.updatePlayer(client.sessionId, player => {
          player.points += 1;
        });
      }
      this.broadcast('message', { ...message, id: client.sessionId });
    });

    this.onMessage('getNextPhrase', client => {
      this.state.currentPhrase = this.getNextPhrase();
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

  cleanPhrase(str: string) {
    return str.toLowerCase().replace(/[^a-z 0-9+]+/gi, '');
  }

  parsePhrases(file: string): string[] {
    return file.split('\n');
  }

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getNextPhrase(): string {
    let index = this.randomInt(0, this.phrases.length);
    return this.cleanPhrase(this.phrases[index]);
  }
}

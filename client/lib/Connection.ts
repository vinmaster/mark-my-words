import { Client } from 'colyseus.js';

export class Connection {
  static IS_DEV = (import.meta as any).env.DEV;
  static client: Client;

  static setup() {
    let url = this.IS_DEV ? `ws://localhost:8000` : `wss://${window.location.host}`;
    this.client = new Client(url);
  }
}

import { Client } from 'colyseus.js';

export class Connection {
  static IS_DEV = (import.meta as any).env.DEV;
  static client: Client;

  static setup() {
    let protocol = location.protocol === 'http:' ? 'ws' : 'wss';
    let url = this.IS_DEV
      ? `${protocol}://localhost:8000`
      : `${protocol}://${window.location.host}`;
    this.client = new Client(url);
  }
}

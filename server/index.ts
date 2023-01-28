import path from 'path';
import { createServer } from 'http';
import express from 'express';
import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import cors from 'cors';
import { monitor } from '@colyseus/monitor';
import { LobbyRoom } from './rooms/LobbyRoom';
import { GameRoom } from './rooms/GameRoom';

const port = Number(process.env.port) || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, './public')));
app.get('/', (_, res) => res.status(200).sendFile(path.resolve(__dirname, './public/index.html')));
app.use('/colyseus', monitor());

const server = createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({ server }),
});
gameServer.define('LobbyRoom', LobbyRoom);
gameServer.define('GameRoom', GameRoom);

gameServer.listen(port);
console.log('Starting on port:', port);

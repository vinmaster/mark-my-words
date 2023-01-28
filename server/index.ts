import path from 'path';
import { createServer } from 'http';
import express from 'express';
import { Server } from 'colyseus';
import cors from 'cors';
import { monitor } from '@colyseus/monitor';
import { LobbyRoom } from './rooms/LobbyRoom';
import { GameRoom } from './rooms/GameRoom';

const port = Number(process.env.port) || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, './public')));
app.get('/', (req, res) =>
  res.status(200).sendFile(path.resolve(__dirname, './public/index.html'))
);
app.use('/colyseus', monitor());

const gameServer = new Server({
  server: createServer(app),
});
gameServer.define('LobbyRoom', LobbyRoom);
gameServer.define('GameRoom', GameRoom);

gameServer.listen(port);
console.log('Starting on port:', port);

/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to use Colyseus Arena
 *
 * If you're self-hosting (without Arena), you can manually instantiate a
 * Colyseus Server as documented here: 👉 https://docs.colyseus.io/server/api/#constructor-options
 */
// import { listen } from "@colyseus/arena";
// import arenaConfig from "./arena.config";
// listen(arenaConfig);

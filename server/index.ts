import { createServer } from 'http';
import express from 'express';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import { LobbyRoom } from './rooms/LobbyRoom';

const port = Number(process.env.port) || 8000;
const app = express();

app.use(express.json());
app.use(express.static(`${process.cwd()}/public`));
app.get('/', (req, res) => {
  res.send("It's time to kick ass and chew bubblegum!");
});
app.use('/colyseus', monitor());

const gameServer = new Server({
  server: createServer(app),
});
gameServer.define('LobbyRoom', LobbyRoom);

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

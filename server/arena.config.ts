// import Arena from '@colyseus/arena';
// import { monitor } from '@colyseus/monitor';
// import express from 'express';

// import { MyRoom } from './rooms/LobbyRoom';

// export default Arena({
//   getId: () => 'mark-my-words',
//   displayLogs: true,

//   initializeGameServer: gameServer => {
//     gameServer.define('my_room', MyRoom);
//   },

//   initializeExpress: app => {
//     app.use(express.static(`${process.cwd()}/public`));
//     app.get('/', (req, res) => {
//       res.send("It's time to kick ass and chew bubblegum!");
//     });
//     app.use('/colyseus', monitor());
//   },

//   beforeListen: () => {
//     /**
//      * Before before gameServer.listen() is called.
//      */
//   },
// });

import { createRouter, createWebHistory } from 'vue-router';
import LobbyRoom from './components/LobbyRoom.vue';
import GameRoom from './components/GameRoom.vue';

export const routes = [
  {
    path: '/',
    name: 'Lobby',
    component: LobbyRoom,
  },
  {
    path: '/rooms/:roomId',
    name: 'GameRoom',
    component: GameRoom,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { Client, RoomAvailable } from 'colyseus.js';

const IS_DEV = (import.meta as any).env.DEV;
let url = IS_DEV ? `ws://localhost:8000` : `wss://${window.location.host}`;
let client = new Client(url);
let rooms: Ref<RoomAvailable[]> = ref([]);

onMounted(async () => {
  console.log('on mounted');
  let lobby = await client.joinOrCreate('LobbyRoom');
  lobby.onMessage('rooms', (x) => rooms = x);
  lobby.onMessage('+', ([roomId, room]) => {
    let roomIndex = rooms.value.findIndex((room) => room.roomId === roomId);
    if (roomIndex !== -1) {
      rooms.value[roomIndex] = room;
    } else {
      rooms.value.push(room);
    }
  });
  lobby.onMessage("-", (roomId) => {
    rooms.value = rooms.value.filter((room) => room.roomId !== roomId);
  });
});
</script>

<template>
  <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
      <a href="#" class="flex items-center">
        <img src="./assets/favicon.png" class="mr-3 h-6 sm:h-9" alt="Logo" />
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Mark My Words</span>
      </a>
      <div class="flex items-center lg:order-2">
        <router-link to="/login"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Home
        </router-link>
      </div>
    </div>
  </nav>

  Rooms:
  <div v-for="room in rooms">
    Room Id: {{ room.roomId }}
  </div>
  <router-view></router-view>
</template>

<style>

</style>
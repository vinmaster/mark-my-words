<script setup lang="ts">
import { Room } from 'colyseus.js';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';
import { Connection } from '../lib/Connection';
import { Util } from '../lib/Util';

interface RoomListingData {
  clients: number;
  createdAt: Date;
  name: string;
  roomId: string;
}

let router = useRouter();
let name = useLocalStorage('name', '');
let isLoaded = ref(false);
let room: Room;
let rooms = ref<RoomListingData[]>([]);
let state = ref<{ players: Map<string, any>; } | undefined>(undefined);

onMounted(async () => {
  console.log('mounted');
  room = await Connection.client.joinOrCreate('LobbyRoom', { name: name.value });
  isLoaded.value = true;
  if (!name.value) name.value = room.sessionId;

  room.onStateChange((s) => {
    state.value = { players: new Map(s.players) };
  });

  room.onMessage('listRooms', (r: any) => {
    isLoaded.value = true;
    rooms.value = r;
  });

  room.onMessage('roomCreated', ({ roomId, name }: { roomId: string, name: string; }) => {
    gotoRoom(roomId);
  });

  room.onLeave(async () => {
    console.log('onLeave');
    // await Util.sleep(1000);
    // window.location.reload();
  });

  room.send('listRooms');
  if (!Connection.IS_DEV) {
    let id = setInterval(() => room.send('listRooms'), 5000);
    (window as any).clear = () => clearInterval(id);
  }
});

onUnmounted(() => {
  console.log('unmounted');
  room.leave();
  // lobby = null as any;
});

function editName() {
  let newName = prompt('New name');
  name.value = newName;
  room.send('editName', newName);
}

function refresh() {
  isLoaded.value = false;
  room.send('listRooms');
}

function createRoom() {
  room.send('createRoom');
}

async function gotoRoom(roomId: string) {
  console.log('going to room', roomId);
  // (window as any).room = await Connection.client.joinById(roomId);
  router.push(`/rooms/${roomId}`);
}
</script>

<template>
  <div class="hero bg-base-200 flex-grow">
    <div class="hero-content text-center flex flex-col w-full max-w-3xl">
      <h1 class="text-5xl font-bold center gap-2 mb-8">
        Lobby
        <div v-if="!isLoaded" class="badge badge-accent">Connecting...</div>
      </h1>

      <div class="card bg-base-100 shadow-xl w-11/12">
        <div class="card-body">
          <h1 class="text-xl">Hi, {{ name }}<button class="btn btn-accent ml-2" @click="editName">Edit Name</button>
          </h1>
          <h3>
            People in the lobby:
            <ul>
              <li class="list-none" v-for="[id, player] in state?.players">{{ player.name }}</li>
            </ul>
          </h3>
          <hr />
          <h2 class="card-title center">List of Game Rooms</h2>
          <p>Join one below OR</p>
          <button type="button" class="btn btn-primary" @click="createRoom()">Create Room</button>
          <hr />
          <button type="button" class="btn btn-secondary" @click="refresh" v-if="isLoaded">Refresh</button>
          <div class="card-actions justify-between items-center" v-for="room in rooms">
            <span>{{ room.name }}</span>
            <span>{{ room.roomId }}</span>
            <span>{{ room.clients }} players</span>
            <button type="button" class="btn btn-primary" @click="gotoRoom(room.roomId)">Join</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
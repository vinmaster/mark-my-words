<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { Room } from 'colyseus.js';
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { Connection } from '../lib/Connection';

interface Message {
  id: string;
  name: string;
  text: string;
  timestamp: Date;
}

let route = useRoute();
let name = useLocalStorage('name', '');
let roomId = route.params.roomId as string;
let isLoaded = ref(false);
let room: Room;
let state = ref<{ players: Map<string, any>; currentPhrase: string; } | undefined>(undefined);
let input = ref('');
let messages = ref<Message[]>([]);
let chatElement = ref<HTMLDivElement>();

onMounted(async () => {
  try {
    room = await Connection.client.joinById(roomId, { name: name.value });
    // room = (window as any).room;
    if (!room) throw new Error('No room found');
  } catch (error) {
    console.error(error);
    (document.getElementById('my-modal') as any).checked = true;
    return;
  }
  isLoaded.value = true;

  room.onStateChange((s) => {
    state.value = { players: new Map(s.players), currentPhrase: s.currentPhrase };
  });

  room.onMessage('message', (message: Message) => {
    messages.value.push(message);
    nextTick(() => {
      chatElement.value?.scrollTo({
        top: chatElement.value.scrollHeight,
        behavior: 'smooth',
      });
    });
  });
});

onUnmounted(() => {
  console.log('unmounted');
  room?.leave();
  // lobby = null as any;
});

function submit() {
  if (!input.value) return;

  room.send('message', {
    name: name.value,
    text: input.value,
    timestamp: new Date(),
  });
  input.value = '';
}
</script>

<template>
  <div class="center" v-if="!isLoaded">
    <div class="badge badge-accent">Connecting...</div>
  </div>

  <div class="bg-base-200 flex flex-grow">
    <div class="text-center flex flex-col md:flex-row flex-grow w-full" id="game-container">
      <div class="flex flex-col md:flex-grow h-1/2 md:h-auto" v-if="isLoaded">
        <h1 class="text-2xl font-bold center gap-2 mb-4">
          Phrase length: {{ state?.currentPhrase.length }}
        </h1>

        <div class="center flex-wrap mb-4">
          <kbd class="kbd" v-for="char in state?.currentPhrase.split('')">{{ char }}</kbd>
        </div>

        <div class="stats stats-vertical shadow bg-primary text-primary-content">
          <div class="stat">
            <div class="stat-title">Actions</div>
            <div class="stat-actions">
              <button class="btn btn-sm btn-secondary" @click="room.send('getNextPhrase')">Next Phrase</button>
            </div>
          </div>

          <div class="divider"></div>

          <div class="stat" v-for="[_, player] in state?.players">
            <div class="stat-title">Player: {{ player.name }}</div>
            <!-- <div class="stat-value">Points: {{ player.points }}</div> -->
            <div class="stat-desc">Points: {{ player.points }}</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col flex-grow md:max-w-md relative h-1/2 md:h-auto md:min-w-10" v-if="isLoaded">
        <div class="flex flex-col mb-12 overflow-y-scroll" ref="chatElement">
          <div class="chat" :class="{
            'chat-end': message.id === room.sessionId,
            'chat-start': message.id !== room.sessionId,
          }" v-for="message in messages">
            <div class="chat-header">{{ message.name }}</div>
            <div class="chat-bubble" :class="{
              'chat-bubble-primary': message.id === room.sessionId,
              'chat-bubble-accent': message.id !== room.sessionId,
            }">{{ message.text }}</div>
            <div class="chat-footer opacity-50">{{ message.timestamp.toLocaleTimeString() }}</div>
          </div>
        </div>

        <div class="w-full mt-auto flex h-12 absolute bottom-0">
          <input v-model="input" @keyup.enter="submit" type="text" placeholder="Type here"
            class="input input-bordered input-primary w-full" />
          <button class="btn btn-primary ml-2" @click="submit">Submit</button>
        </div>
      </div>
    </div>
  </div>

  <input type="checkbox" id="my-modal" class="modal-toggle" />
  <label for="my-modal" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <div class="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error!</span>
        </div>
      </div>
      <p class="py-4">This room no longer exists</p>
      <router-link to="/" class="btn btn-primary">Go to Lobby</router-link>
    </label>
  </label>
</template>

<style scoped>
#game-container {
  height: calc(100vh - 56px);
}
</style>
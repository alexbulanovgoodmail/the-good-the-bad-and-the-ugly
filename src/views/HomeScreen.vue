<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '@/router'
import Typed from 'typed.js'

import enterSound from '@/assets/sounds/sound-enter.mp3'

const musicEnterAudio = new Audio(enterSound)
musicEnterAudio.currentTime = 0

const textRef = ref<HTMLElement | null>(null)

const handleStart = () => {
  musicEnterAudio.play().catch(() => {})
  router.push('/saloon')
}

onMounted(() => {
  new Typed(textRef.value, {
    strings: [
      'Здесь закон пишется свинцом, а удача улыбается смелым. Тишина прерывается щелчком револьвера...',
    ],
    typeSpeed: 30,
    showCursor: false,
  })
})
</script>

<template>
  <div class="home-screen">
    <div class="home-screen__text-container nes-container is-dark">
      <p ref="textRef" class="home-screen__text"></p>
      <div class="home-screen__actions">
        <button class="nes-btn" type="button" @click="handleStart">
          Начать игру
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-screen {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 64px;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/home-screen.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &__text-container {
    width: 100%;
    height: 172px;
  }

  &__text {
    height: 48px;
    text-wrap: pretty;
  }

  &__actions {
    text-align: center;
  }
}
</style>

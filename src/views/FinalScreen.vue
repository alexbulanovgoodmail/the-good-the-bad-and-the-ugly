<script setup lang="ts">
import { onMounted } from 'vue'
import { useDialog } from '@/composables/useDialog'
import FinalDialog from '@/components/FinalDialog.vue'
import finalSound from '@/assets/sounds/cut.mp3'
import shotSound from '@/assets/sounds/shot-02.mp3'
import GameDashboard from '@/components/GameDashboard.vue'

const SHOT_TIMEOUT = 1000
const musicAudio = new Audio(finalSound)
const shotAudio = new Audio(shotSound)
musicAudio.currentTime = 0
shotAudio.currentTime = 0

musicAudio.addEventListener('ended', () => {
  setTimeout(() => {
    // shotAudio.play()
  }, SHOT_TIMEOUT)
})

const { openModal, closeAll } = useDialog()

const handleStart = async () => {
  await closeAll()
  musicAudio.play()
}

onMounted(() => {
  openModal({
    component: FinalDialog,
    componentProps: {
      onStart: handleStart,
    },
  })
})
</script>

<template>
  <div class="final-screen">
    <div class="boss"></div>
    <GameDashboard />
  </div>
</template>

<style lang="scss" scoped>
.final-screen {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 64px;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/final-screen.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  cursor:
    url('@/assets/images/crosshair.svg') 16 16,
    auto;
}

.boss {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, 0);
  background-image: url('@/assets/images/boss-01.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>

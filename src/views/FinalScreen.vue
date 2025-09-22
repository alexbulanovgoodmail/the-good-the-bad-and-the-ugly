<script setup lang="ts">
import { GameOverStatus } from '@/types'
import router from '@/router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useDialog } from '@/composables/useDialog'
import { storeGame } from '@/stores/storeGame'
import GameDialog from '@/components/GameDialog.vue'
import finalSound from '@/assets/sounds/cut.mp3'
import shotBanditSoundUrl from '@/assets/sounds/shot-02.mp3'

import youWinSound from '@/assets/sounds/sound-win.mp3'
import youDeadSound from '@/assets/sounds/sound-lose.mp3'
import youFailSound from '@/assets/sounds/sound-fail.mp3'

import youWinImg from '@/assets/images/win-01.webp'
import youDeadImg from '@/assets/images/lose-01.webp'
import youFailImg from '@/assets/images/lose-02.webp'

import banditDefaultImg from '@/assets/images/boss-01.webp'
import banditWinImg from '@/assets/images/boss-02.webp'
import banditDeadImg from '@/assets/images/boss-03.webp'

const game = storeGame()
const { shot } = game

const sounds = {
  [GameOverStatus.WIN]: youWinSound,
  [GameOverStatus.DEAD]: youDeadSound,
  [GameOverStatus.LOSE]: youFailSound,
}

const titles = {
  [GameOverStatus.WIN]: 'Самая быстрая рука в городе.',
  [GameOverStatus.DEAD]: 'Твоя последняя схватка',
  [GameOverStatus.LOSE]: 'Торопливость сгубила тебя.',
}

const images = {
  [GameOverStatus.WIN]: youWinImg,
  [GameOverStatus.DEAD]: youDeadImg,
  [GameOverStatus.LOSE]: youFailImg,
}

const SHOT_TIMEOUT = 600
const musicTimerAudio = new Audio(finalSound)
const shotBanditAudio = new Audio(shotBanditSoundUrl)
musicTimerAudio.currentTime = 0
shotBanditAudio.currentTime = 0

const areaRef = ref<HTMLElement | null>(null)
const shotTimer = ref<number | null>(null)
const hasYourShot = ref<boolean>(false)
const hasHitBandit = ref<boolean>(false)
const banditImgUrl = ref<string>(banditDefaultImg)

const banditStyle = computed(() => ({
  backgroundImage: `url(${banditImgUrl.value})`,
}))

const isMusicPlaying = ref<boolean>(false)
const isShotAllowed = ref<boolean>(false)

musicTimerAudio.addEventListener('ended', () => {
  isMusicPlaying.value = false
  isShotAllowed.value = true

  shotTimer.value = setTimeout(() => {
    if (!hasHitBandit.value) {
      shotBanditAudio.play()
      banditImgUrl.value = banditWinImg
      handleGameOver(GameOverStatus.DEAD)
    }
  }, SHOT_TIMEOUT)
})

const { openModal, closeAll } = useDialog()

const handleStart = async () => {
  await closeAll()

  hasYourShot.value = false
  hasHitBandit.value = false
  isShotAllowed.value = false

  musicTimerAudio.currentTime = 0
  musicTimerAudio.play()
  isMusicPlaying.value = true
}

const handleGameOver = (result: GameOverStatus) => {
  hasYourShot.value = true

  const DIALOG_TIMEOUT = 2000

  const audio = new Audio(sounds[result])
  audio.currentTime = 0

  setTimeout(() => {
    audio.play().catch(() => {})

    openModal({
      component: GameDialog,
      componentProps: {
        text: titles[result],
        image: images[result],
        textQuit: 'Выйти',
        onQuit: async () => {
          await closeAll()
          audio.pause()
          router.push('/')
        },
      },
    })
  }, DIALOG_TIMEOUT)
}

const handleClick = (event: Event) => {
  if (hasYourShot.value) return
  shot()

  if (isMusicPlaying.value) {
    musicTimerAudio.pause()
    handleGameOver(GameOverStatus.LOSE)
  } else if (isShotAllowed.value) {
    const target = event.target as HTMLElement

    if (target.closest('.damage-area')) {
      hasHitBandit.value = true
      banditImgUrl.value = banditDeadImg
      clearTimeout(shotTimer.value!)
      handleGameOver(GameOverStatus.WIN)
    }
  }
}

onMounted(() => {
  openModal({
    component: GameDialog,
    componentProps: {
      text: 'Музыка стихнет — стреляй первым. Ошибки не прощаются.',
      textStart: 'Начать',
      onStart: handleStart,
    },
  })

  areaRef.value?.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  areaRef.value?.removeEventListener('click', handleClick)
  clearTimeout(shotTimer.value!)
})
</script>

<template>
  <div ref="areaRef" class="final-screen">
    <div class="bandit" :style="banditStyle">
      <div class="damage-area"></div>
    </div>
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

.bandit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, 0);

  // background-image: url('@/assets/images/boss-01.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.damage-area {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 100px;
  transform: translate(-50%, -50%);
}
</style>

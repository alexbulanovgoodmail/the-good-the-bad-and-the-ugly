<script setup lang="ts">
import type { Slot, Person } from '@/types'
import router from '@/router'
import { GameOverStatus } from '@/types'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { storeGame } from '@/stores/storeGame'
import { useUtils } from '@/composables/useUtils'
import { useDialog } from '@/composables/useDialog'
import GameDialog from '@/components/GameDialog.vue'

import shotBanditSound from '@/assets/sounds/shot-02.mp3'
import youWinSound from '@/assets/sounds/sound-win.mp3'
import youDeadSound from '@/assets/sounds/sound-lose.mp3'
import youFailSound from '@/assets/sounds/sound-fail.mp3'

import bandit01 from '@/assets/images/bandit-01.webp'
import bandit02 from '@/assets/images/bandit-02.webp'
import bandit03 from '@/assets/images/bandit-03.webp'
import bandit04 from '@/assets/images/bandit-04.webp'
import bandit05 from '@/assets/images/bandit-05.webp'
import civilian01 from '@/assets/images/civilian-01.webp'
import civilian02 from '@/assets/images/civilian-02.webp'

const MIN_DELAY = 1000
const BASE_DELAY = 4000
const SPAWN_PERSON_DELAY = 3000
const SHOW_DURATION = 4000
const { randomInteger } = useUtils()
const { openModal, closeAll } = useDialog()

const game = storeGame()
const {
  reset,
  shot,
  rebootClip,
  stopReload,
  maxRounds,
  maxSessions,
  rewardForKill,
  increaseRound,
  increaseSession,
} = game
const { reloading, clip, round, session } = storeToRefs(game)

const areaRef = ref<HTMLElement | null>(null)
const isGameOver = ref<boolean>(false)
const sessionTimer = ref<number | null>(null)
const slots = ref<Slot[]>([null, null, null, null, null])

const titles = {
  [GameOverStatus.WIN]: 'Он ждёт тебя — финал близок.',
  [GameOverStatus.DEAD]: 'Твоя последняя схватка.',
  [GameOverStatus.LOSE]: 'Невиновный пал от твоей пули.',
}

const sounds = {
  [GameOverStatus.WIN]: youWinSound,
  [GameOverStatus.DEAD]: youDeadSound,
  [GameOverStatus.LOSE]: youFailSound,
}

const persons: Person[] = [
  { name: 'Bandit 1', image: bandit01, type: 'bandit' },
  { name: 'Bandit 2', image: bandit02, type: 'bandit' },
  { name: 'Bandit 3', image: bandit03, type: 'bandit' },
  { name: 'Bandit 4', image: bandit04, type: 'bandit' },
  { name: 'Bandit 5', image: bandit05, type: 'bandit' },
]

const civilians: Person[] = [
  { name: 'Civilian 1', image: civilian01, type: 'civilian' },
  { name: 'Civilian 2', image: civilian02, type: 'civilian' },
]

const handleGameOver = (result: GameOverStatus) => {
  const DIALOG_TIMEOUT = 2000

  isGameOver.value = true

  if (sessionTimer.value) {
    clearTimeout(sessionTimer.value)
    sessionTimer.value = null
  }

  if (reloading.value) {
    stopReload()
  }

  if (result === GameOverStatus.DEAD) {
    const killerIndex = slots.value.findIndex(
      s => s && s.alive && s.person.type === 'bandit',
    )

    if (killerIndex !== -1) {
      slots.value[killerIndex]!.highlighted = true
    }

    areaRef.value?.classList.add('is-dead')

    const audio = new Audio(shotBanditSound)
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  if (result === GameOverStatus.LOSE) {
    const killedIndex = slots.value.findIndex(
      s => s && !s.alive && s.person.type === 'civilian',
    )

    if (killedIndex !== -1) {
      slots.value[killedIndex]!.highlighted = true
    }
  }

  const audio = new Audio(sounds[result])
  audio.currentTime = 0
  audio.play().catch(() => {})

  if (result === GameOverStatus.WIN) {
    audio.pause()
  }

  setTimeout(() => {
    if (result === GameOverStatus.WIN) {
      openModal({
        component: GameDialog,
        componentProps: {
          text: titles[result],
          textQuit: 'Выйти',
          onQuit: async () => {
            await closeAll()
            audio.pause()
            router.push('/')
          },
          textStart: 'Готов',
          onStart: async () => {
            await closeAll()
            audio.pause()
            router.push('/final')
          },
        },
      })
    } else {
      openModal({
        component: GameDialog,
        componentProps: {
          text: titles[result],
          textQuit: 'Выйти',
          onQuit: async () => {
            await closeAll()
            audio.pause()
            router.push('/')
          },
          textStart: 'Заново',
          onStart: async () => {
            await closeAll()
            audio.pause()
            reset()
            startRound()
            areaRef.value?.classList.remove('is-dead')
          },
        },
      })
    }
  }, DIALOG_TIMEOUT)
}

const nextSessionOrRound = () => {
  if (session.value < maxSessions) {
    increaseSession()
    const delay = getSpawnDelay()
    sessionTimer.value = setTimeout(spawnPersons, delay)
  } else if (round.value < maxRounds) {
    increaseRound()
    startRound()
  } else {
    handleGameOver(GameOverStatus.WIN)
  }
}

const getSpawnDelay = () => {
  const interval = BASE_DELAY - (round.value + 1) * 1000
  return Math.max(interval, MIN_DELAY)
}

const spawnPersons = () => {
  slots.value = [null, null, null, null, null]

  const count = Math.min(round.value, slots.value.length)
  const available = [0, 1, 2, 3, 4]

  for (let i = 0; i < count; i++) {
    const idx = randomInteger(0, available.length - 1)
    const slotIndex = available[idx]
    available.splice(idx, 1)

    const isCivilian = round.value >= 4 && Math.random() < 0.25
    const person = isCivilian
      ? civilians[randomInteger(0, civilians.length - 1)]
      : persons[randomInteger(0, persons.length - 1)]

    slots.value[slotIndex] = { person, alive: true, highlighted: false }
  }

  const hasBandit = slots.value.some(s => s && s.person.type === 'bandit')
  if (!hasBandit) {
    nextSessionOrRound()
    return
  }

  sessionTimer.value = setTimeout(() => {
    if (slots.value.some(s => s && s.alive && s.person.type === 'bandit')) {
      handleGameOver(GameOverStatus.DEAD)
    }
  }, SHOW_DURATION)
}

const handlePlay = async () => {
  await closeAll()
  setTimeout(spawnPersons, SPAWN_PERSON_DELAY)
}

const startRound = async () => {
  isGameOver.value = false
  sessionTimer.value = null
  slots.value = [null, null, null, null, null]

  await closeAll()
  rebootClip()

  openModal({
    component: GameDialog,
    componentProps: {
      text: 'Раунд ' + round.value,
      textStart: 'Начать',
      onStart: handlePlay,
    },
  })
}

const handleHit = (index: number) => {
  const slot = slots.value[index]
  if (!slot || !slot.alive) return

  slot.alive = false

  if (slot.person.type === 'civilian') {
    handleGameOver(GameOverStatus.LOSE)
    return
  }

  rewardForKill()

  const anyAlive = slots.value.some(
    s => s && s.alive && s.person.type === 'bandit',
  )

  if (!anyAlive) {
    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
      sessionTimer.value = null
    }
    nextSessionOrRound()
  }
}

const handleClick = (event: Event) => {
  if (isGameOver.value || reloading.value) return

  const target = event.target as HTMLElement

  if (clip.value > 0 && target.closest('.damage-area')) {
    const index = target.dataset.index
    if (index !== undefined) {
      handleHit(Number(index))
    }
  }
  shot()
}

onMounted(() => {
  reset()
  startRound()
  areaRef.value?.classList.remove('is-dead')
  areaRef.value?.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  areaRef.value?.classList.remove('is-dead')
  areaRef.value?.removeEventListener('click', handleClick)
})
</script>

<template>
  <div ref="areaRef" class="saloon-screen">
    <div class="saloon-screen__overlay"></div>

    <div
      v-for="(slot, index) in slots"
      :key="index"
      :class="[
        `slot slot--${index + 1}`,
        {
          'is-highlighted': slot?.highlighted,
        },
      ]"
      :style="{
        backgroundImage:
          slot && slot.person.type === 'bandit' && slot.alive
            ? `url(${slot.person.image})`
            : slot && slot.person.type === 'civilian'
              ? `url(${slot.person.image})`
              : 'none',
      }"
    >
      <div
        v-if="slot && slot.alive"
        class="damage-area"
        :data-index="index"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.saloon-screen {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 64px;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/saloon-screen.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  cursor:
    url('@/assets/images/crosshair.svg') 16 16,
    auto;

  &.is-dead::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #f00, $alpha: 40%);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-image: url('@/assets/images/saloon-overlay.webp');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.damage-area {
  position: absolute;
  z-index: 5;
}

.slot {
  position: absolute;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &.is-highlighted {
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #f00, $alpha: 30%);
    }
  }

  &--1 {
    top: 80px;
    left: 146px;
    width: 160px;
    height: 192px;

    .damage-area {
      top: 10px;
      left: 40px;
      width: 80px;
      height: 140px;
    }
  }

  &--2 {
    top: 80px;
    left: 726px;
    width: 160px;
    height: 192px;

    .damage-area {
      top: 10px;
      left: 40px;
      width: 80px;
      height: 140px;
    }
  }

  &--3 {
    top: 402px;
    left: 120px;
    width: 160px;
    height: 192px;

    .damage-area {
      top: 10px;
      left: 40px;
      width: 80px;
      height: 164px;
    }
  }

  &--4 {
    top: 372px;
    left: 434px;
    width: 160px;
    height: 288px;

    .damage-area {
      top: 40px;
      left: 40px;
      width: 80px;
      height: 164px;
    }
  }

  &--5 {
    top: 402px;
    left: 754px;
    width: 160px;
    height: 192px;

    .damage-area {
      top: 10px;
      left: 40px;
      width: 80px;
      height: 164px;
    }
  }
}
</style>

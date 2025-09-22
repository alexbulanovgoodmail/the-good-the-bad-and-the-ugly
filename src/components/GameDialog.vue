<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  text: string
  image?: string
  textStart?: string
  textQuit?: string
}

const {
  text,
  textStart = undefined,
  textQuit = undefined,
} = defineProps<Props>()

const emits = defineEmits<{
  (e: 'start' | 'quit'): void
}>()

import Typed from 'typed.js'

const textRef = ref<HTMLElement | null>(null)

onMounted(() => {
  new Typed(textRef.value, {
    strings: [text],
    typeSpeed: 30,
    showCursor: false,
  })
})
</script>

<template>
  <div class="game-dialog nes-container">
    <p ref="textRef" class="game-dialog__text"></p>

    <div v-if="image" class="game-dialog__image">
      <img :src="image" width="100" height="100" alt="" />
    </div>

    <button
      v-if="textStart"
      class="nes-btn"
      type="button"
      @click="emits('start')"
    >
      {{ textStart }}
    </button>

    <button
      v-if="textQuit"
      class="nes-btn"
      type="button"
      @click="emits('quit')"
    >
      {{ textQuit }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.game-dialog {
  color: #000;
  background-color: #fff;

  &__text {
    margin: 0 auto 24px;
    height: 48px;
    text-wrap: pretty;
  }

  &__image {
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;

    img {
      width: auto;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>

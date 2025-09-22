<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emits = defineEmits<{
  (e: 'start'): void
}>()

import Typed from 'typed.js'

const textRef = ref<HTMLElement | null>(null)

onMounted(() => {
  new Typed(textRef.value, {
    strings: ['Музыка стихнет — стреляй первым. Ошибки не прощаются.'],
    typeSpeed: 30,
    showCursor: false,
  })
})
</script>

<template>
  <div class="final-dialog nes-container">
    <p ref="textRef" class="final-dialog__text"></p>

    <button class="nes-btn" type="button" @click="emits('start')">
      Начать
    </button>
  </div>
</template>

<style lang="scss" scoped>
.final-dialog {
  height: 200px;
  color: #000;
  background-color: #fff;

  &__text {
    margin: 0 0 48px;
    height: 48px;
    text-wrap: pretty;
  }
}
</style>

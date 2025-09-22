<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { storeGame } from '@/stores/storeGame'

const game = storeGame()

const { reload } = game
const { clip } = storeToRefs(game)

const handleClick = () => {
  reload()
}
</script>

<template>
  <div class="clip-cartridges" @click="handleClick">
    <div class="clip-cartridges__slots">
      <div class="clip-cartridges__slot"></div>
      <div class="clip-cartridges__slot"></div>
      <div class="clip-cartridges__slot"></div>
      <div class="clip-cartridges__slot"></div>
      <div class="clip-cartridges__slot"></div>
      <div class="clip-cartridges__slot"></div>

      <div class="clip-cartridges__clips">
        <div v-for="_ in clip" :key="_" class="clip-cartridges__clip"></div>
      </div>
    </div>

    <div class="clip-cartridges__sub-label">нажми для перезарядки</div>
  </div>
</template>

<style lang="scss" scoped>
.clip-cartridges {
  --slot-offset: 9px;
  --slot-width: 20px;
  --slot-height: 20px;

  &__sub-label {
    margin: 12px 0 0;
    font-size: 8px;
  }

  &__slots {
    position: relative;
    display: flex;

    & > * + * {
      margin-left: var(--slot-offset);
    }
  }

  &__slot {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: var(--slot-width);
    width: var(--slot-height);
    box-shadow:
      2px 0 var(--color-2),
      4px 0 var(--color-2),
      0 2px var(--color-2),
      2px 2px var(--color-2),
      4px 2px var(--color-2),
      0 4px var(--color-2),
      2px 4px var(--color-2),
      4px 4px var(--color-2);
  }

  &__clip {
    position: absolute;
    top: 3px;
    left: 3px;
    display: flex;
    width: 14px;
    height: 14px;
    background-color: var(--color-2);
  }

  &__clip:nth-child(2) {
    left: calc(var(--slot-width) + var(--slot-offset) + 3px);
  }

  &__clip:nth-child(3) {
    left: calc((var(--slot-width) * 2) + (var(--slot-offset) * 2) + 3px);
  }

  &__clip:nth-child(4) {
    left: calc((var(--slot-width) * 3) + (var(--slot-offset) * 3) + 3px);
  }

  &__clip:nth-child(5) {
    left: calc((var(--slot-width) * 4) + (var(--slot-offset) * 4) + 3px);
  }

  &__clip:nth-child(6) {
    left: calc((var(--slot-width) * 5) + (var(--slot-offset) * 5) + 3px);
  }
}
</style>

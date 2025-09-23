<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { storeGame } from '@/stores/storeGame'

const game = storeGame()

const { bank } = storeToRefs(game)

const formattedBank = computed(() =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol',
  }).format(bank.value),
)
</script>

<template>
  <div class="score-tracker">
    <div class="score-tracker__label">{{ formattedBank }}</div>
  </div>
</template>

<style lang="scss" scoped>
.score-tracker {
  &__label {
    font-size: 24px;
  }
}
</style>

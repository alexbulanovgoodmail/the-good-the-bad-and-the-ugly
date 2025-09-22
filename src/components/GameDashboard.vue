<script setup lang="ts">
import ClipCartridges from '@/components/ClipCartridges.vue'
import ScoreTracker from '@/components//ScoreTracker.vue'
</script>

<template>
  <div class="game-dashboard">
    <ClipCartridges class="game-dashboard__clip-cartridges" />
    <ScoreTracker class="game-dashboard__score-tracker" />
  </div>
</template>

<style lang="scss" scoped>
.game-dashboard {
  // position: absolute;
  // bottom: 0;
  // left: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;

  // height: 100px;
  padding: 24px 48px 0;
  color: #fff;
  background-color: #212529;

  &__clip-cartridges {
    align-self: flex-end;
  }

  &__score-tracker {
    align-self: center;
  }
}
</style>

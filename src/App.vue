<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
</script>

<template>
  <div class="app-wrapper">
    <RouterView />
    <RouterView name="dashboard" />

    <ModalsContainer />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  width: 1024px;
  height: 768px;
  overflow: hidden;
}
</style>

<script setup lang="ts"></script>

<template>
  <div class="final-screen">
    <div class="boss"></div>
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
}

.boss {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, 0);
  background-image: url('@/assets/images/boss-03.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>

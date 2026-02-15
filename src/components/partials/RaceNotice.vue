<template>
  <div class="race-notice">
    <div class="race-notice-content">
      <img src="@/assets/img/svg/horse-head.svg" alt="Horse Racing" width="80" />
      <h4 class="race-notice-text">{{ message }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<style scoped lang="scss">
.race-notice {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #0000004d;
  z-index: 2;
}

.race-notice-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background-color: var(--color-white);
  padding: 16px;
  border-radius: var(--border-radius);
  max-width: 300px;
}

.race-notice-text {
  text-align: center;
  white-space: pre-wrap;
}
</style>

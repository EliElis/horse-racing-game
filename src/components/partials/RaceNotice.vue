<template>
  <div class="race-notice" data-testid="race-notice">
    <img src="@/assets/img/svg/horse-head.svg" alt="Horse Racing" width="60" />
    <h4 class="race-notice-text">{{ message }}</h4>
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
  top: 50%;
  left: 50%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  max-width: 300px;
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transform: translate(-50%, -50%);
}

.race-notice-text {
  text-align: center;
  white-space: pre-wrap;
}
</style>

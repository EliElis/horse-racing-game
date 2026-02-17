<template>
  <div class="color-box-wrapper">
    <span class="color-box" :style="{ backgroundColor: color }" />
    <span class="color-box-tooltip">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color: string
  label: string
}>()
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.color-box-wrapper {
  position: relative;
  display: inline-block;

  &:hover .color-box-tooltip {
    visibility: visible;
    opacity: 1;
  }
}

.color-box {
  display: block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-button);
}

.color-box-tooltip {
  @include tooltip;
  position: absolute;
  top: -3px;
  right: calc(100% + 2px);
}
</style>

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

<style scoped>
.color-box-wrapper {
  position: relative;
  display: inline-block;

  &:hover .color-box-tooltip {
    opacity: 1;
    visibility: visible;
  }
}

.color-box {
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-button);
  cursor: pointer;
}

.color-box-tooltip {
  position: absolute;
  top: -3px;
  right: calc(100% + 2px);
  padding: 4px 8px;
  border-radius: var(--border-radius-button);
  background-color: #333;
  color: var(--color-white);
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
}
</style>

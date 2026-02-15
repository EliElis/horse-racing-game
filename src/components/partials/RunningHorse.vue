<template>
  <div class="running-horse" :style="{ color: fillColor }" v-html="currentFrame" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import horse1Raw from '@/assets/img/svg/horse-1.svg?raw'
import horse2Raw from '@/assets/img/svg/horse-2.svg?raw'
import horse3Raw from '@/assets/img/svg/horse-3.svg?raw'
import horseStandingRaw from '@/assets/img/svg/horse-standing.svg?raw'

const frames = [horse1Raw, horse2Raw, horse1Raw, horse3Raw]
const FRAME_COUNT = frames.length

const props = withDefaults(
  defineProps<{
    fillColor: string
    isRunning?: boolean
  }>(),
  {
    isRunning: false,
  },
)

const currentFrameIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const currentFrame = computed(() =>
  props.isRunning ? frames[currentFrameIndex.value] : horseStandingRaw,
)

function startAnimation() {
  if (intervalId) return
  intervalId = setInterval(() => {
    currentFrameIndex.value = (currentFrameIndex.value + 1) % FRAME_COUNT
  }, 150)
}

function stopAnimation() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

watch(
  () => props.isRunning,
  (running) => {
    if (running) {
      startAnimation()
    } else {
      stopAnimation()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.isRunning) startAnimation()
})

onUnmounted(() => {
  stopAnimation()
})
</script>

<style scoped>
.running-horse {
  display: inline-block;
}

.running-horse :deep(svg) {
  width: 60px;
  height: 60px;
}
</style>

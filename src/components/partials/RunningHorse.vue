<template>
  <div class="running-horse" :style="{ color: fillColor }" v-html="currentFrame" />
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import horse1Raw from '@/assets/img/svg/horse-1.svg?raw'
import horse2Raw from '@/assets/img/svg/horse-2.svg?raw'
import horse3Raw from '@/assets/img/svg/horse-3.svg?raw'
import horseStandingRaw from '@/assets/img/svg/horse-standing.svg?raw'

const frames = [horse1Raw, horse2Raw, horse3Raw, horse2Raw]
const FRAME_COUNT = frames.length

const props = withDefaults(
  defineProps<{
    fillColor: string
    isRunning?: boolean
    animationSpeed?: number
  }>(),
  {
    isRunning: false,
    animationSpeed: 150,
  },
)

const currentFrameIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const currentFrame = computed(() =>
  props.isRunning ? frames[currentFrameIndex.value] : horseStandingRaw,
)

function startAnimation() {
  stopAnimation()
  intervalId = setInterval(() => {
    currentFrameIndex.value = (currentFrameIndex.value + 1) % FRAME_COUNT
  }, props.animationSpeed)
}

function stopAnimation() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

watch(
  () => [props.isRunning, props.animationSpeed] as const,
  ([running]) => {
    if (running) {
      startAnimation()
    } else {
      stopAnimation()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  stopAnimation()
})
</script>

<style scoped>
.running-horse {
  display: inline-block;
}
</style>

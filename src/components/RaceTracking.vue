<template>
  <div
    class="race-tracking"
    v-if="raceStore.isScheduleGenerated && (raceStore.currentRoundData || raceStore.isRaceComplete)"
  >
    <Transition name="fade" mode="out-in">
      <div :key="raceStore.currentRound" class="race-tracking-lanes">
        <div
          v-for="(horse, index) in displayRoundData?.horses"
          :key="horse.id"
          class="race-tracking-lane"
        >
          <div class="number" :style="{ '--horse-color': horse.color }">
            {{ index + 1 }}
            <span class="number-tooltip">{{ horse.name }}</span>
          </div>
          <div class="track">
            <RunningHorse
              class="horse"
              :style="{ left: progressPercent(horse.id) + '%' }"
              :fill-color="horse.color"
              :is-running="isHorseRunning(horse.id)"
              :animation-speed="horseAnimationSpeed(horse.condition)"
              @transitionend="onHorseTransitionEnd($event, horse.id)"
            />
          </div>
        </div>
      </div>
    </Transition>
    <RaceNotice v-if="raceNoticeText" :message="raceNoticeText" />
  </div>
  <div class="race-tracking race-tracking-placeholder" v-else>
    <div v-for="i in 10" :key="i" class="race-tracking-lane">
      <div class="number">{{ i }}</div>
      <div class="track"></div>
    </div>
    <RaceNotice message="Generate a schedule to start racing" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRaceStore } from '@/stores/race'
import RunningHorse from '@/components/partials/RunningHorse.vue'
import RaceNotice from '@/components/partials/RaceNotice.vue'

const raceStore = useRaceStore()
const transitionFinished = reactive(new Set<number>())

const displayRoundData = computed(() => {
  if (raceStore.currentRoundData) return raceStore.currentRoundData
  if (raceStore.isRaceComplete && raceStore.schedule.length > 0) {
    return raceStore.schedule[raceStore.schedule.length - 1]
  }
  return null
})

watch(
  () => raceStore.currentRound,
  () => {
    transitionFinished.clear()
  },
)

function isHorseRunning(horseId: number): boolean {
  if (!raceStore.isRacing || raceStore.isPaused) return false
  return !transitionFinished.has(horseId)
}

function onHorseTransitionEnd(event: TransitionEvent, horseId: number) {
  if (event.propertyName === 'left' && progressPercent(horseId) >= 100) {
    transitionFinished.add(horseId)
  }
}

const raceNoticeText = computed(() => {
  if (raceStore.isRaceComplete)
    return 'All races are finished!\nReset the race and generate a new schedule!'
  if (raceStore.isPaused) return "Race paused. Press Start to resume when you're ready!"
  if (!raceStore.isRacing && raceStore.currentRound === 0) return 'Press START to begin the race'
  if (!raceStore.isRacing && raceStore.currentRound > 0 && !raceStore.isRaceComplete)
    return `Round ${raceStore.currentRound} is finished.\n Press START for the next round!`
  return null
})

function horseAnimationSpeed(condition: number): number {
  return 200 - (condition / 100) * 120
}

function progressPercent(horseId: number): number {
  if (raceStore.isRaceComplete) return 100
  const progress = raceStore.raceProgress[horseId] ?? 0
  const distance = displayRoundData.value?.distance ?? 1
  return Math.min((progress / distance) * 100, 100)
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.race-tracking {
  --lane-height: 70px;
  --horse-icon-size: 60px;
  position: relative;
  min-width: 300px;
  max-height: var(--content-height-padded);
  overflow: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);

  &.race-tracking-placeholder {
    overflow: hidden;
  }

  @media (max-width: $breakpoint-md) {
    max-height: none;
  }
}

.race-tracking-lane {
  display: flex;
  gap: 8px;
  align-items: center;
  height: var(--lane-height);
  padding: 4px 8px;
  background: #f5f5f5;
  border-bottom: 1px solid var(--border-color);

  .number {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--horse-icon-size);
    height: 100%;
    min-height: var(--horse-icon-size);
    color: var(--color-white);
    cursor: pointer;

    &:hover .number-tooltip {
      visibility: visible;
      opacity: 1;
    }

    .number-tooltip {
      @include tooltip;
      position: absolute;
      top: 50%;
      left: calc(100% + 4px);
      z-index: 10;
      transform: translateY(-50%);
    }

    &::before {
      position: absolute;
      z-index: -1;
      width: 38px;
      height: 38px;
      content: '';
      background-color: var(--horse-color, #9e9e9e);
      border: 3px solid var(--border-color);
      border-radius: 50%;
    }
  }

  .track {
    position: relative;
    width: 100%;
    height: 100%;
    padding-left: var(--horse-icon-size);
  }

  .horse {
    position: relative;
    transform: translateX(-100%);
    transition: left 0.3s linear;

    :deep(svg) {
      width: var(--horse-icon-size);
      height: var(--horse-icon-size);
    }
  }
}
</style>

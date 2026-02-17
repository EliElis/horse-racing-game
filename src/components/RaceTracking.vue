<template>
  <div class="race-tracking" v-if="raceStore.isScheduleGenerated && raceStore.currentRoundData">

      <Transition name="fade" mode="out-in">
        <div :key="raceStore.currentRound" class="race-tracking-lanes">
          <div
            v-for="(horse, index) in raceStore.currentRoundData?.horses"
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

watch(() => raceStore.currentRound, () => {
  transitionFinished.clear()
})

function isHorseRunning(horseId: number): boolean {
  if (!raceStore.isRacing || raceStore.isPaused) return false
  return !transitionFinished.has(horseId);

}

function onHorseTransitionEnd(event: TransitionEvent, horseId: number) {
  if (event.propertyName === 'left' && progressPercent(horseId) >= 100) {
    transitionFinished.add(horseId)
  }
}

const raceNoticeText = computed(() => {
  if (raceStore.isRaceComplete) return 'All races are finished!'
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
  const progress = raceStore.raceProgress[horseId] ?? 0
  const distance = raceStore.currentRoundData?.distance ?? 1
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
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  overflow: auto;
  &.race-tracking-placeholder {
    overflow: hidden;
  }
  @media (max-width: $breakpoint-md) {
    max-height: none;
  }
}

.race-tracking-lane {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid var(--border-color);
  padding: 4px 8px;
  height: var(--lane-height);
  .number {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--horse-icon-size);
    min-height: var(--horse-icon-size);
    height: 100%;
    color: var(--color-white);
    cursor: pointer;
    z-index: 1;

    &:hover .number-tooltip {
      opacity: 1;
      visibility: visible;
    }

    .number-tooltip {
      @include tooltip;
      position: absolute;
      top: 50%;
      left: calc(100% + 4px);
      transform: translateY(-50%);
      z-index: 10;
    }

    &:before {
      content: '';
      position: absolute;
      width: 38px;
      height: 38px;
      background-color: var(--horse-color, #9e9e9e);
      border-radius: 50%;
      z-index: -1;
      border: 3px solid var(--border-color);
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
    transition: left 0.3s linear;
    transform: translateX(-100%);

    :deep(svg) {
      width: var(--horse-icon-size);
      height: var(--horse-icon-size);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

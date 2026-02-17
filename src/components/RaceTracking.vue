<template>
  <div class="race-tracking" v-if="raceStore.isScheduleGenerated && raceStore.currentRoundData">
    <Transition name="fade" mode="out-in">
      <div :key="raceStore.currentRound" class="race-tracking-lanes">
        <div
          v-for="(horse, index) in raceStore.currentRoundData?.horses"
          :key="horse.id"
          class="race-tracking-lane"
        >
          <div class="number" :style="{ '--horse-color': horse.color }">{{ index + 1 }}</div>
          <div class="track">
            <RunningHorse
              class="horse"
              :style="{ left: progressPercent(horse.id) + '%' }"
              :fill-color="horse.color"
              :is-running="raceStore.isRacing && !raceStore.isPaused && progressPercent(horse.id) < 100"
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
import { computed } from 'vue'
import { useRaceStore } from '@/stores/race'
import RunningHorse from '@/components/partials/RunningHorse.vue'
import RaceNotice from '@/components/partials/RaceNotice.vue'

const raceStore = useRaceStore()

const raceNoticeText = computed(() => {
  if (raceStore.isRaceComplete) return 'All races are finished!'
  if (raceStore.isPaused) return "Race paused. Press Start to resume when you're ready!"
  if (!raceStore.isRacing && raceStore.currentRound === 0) return 'Press START to begin the race'
  if (!raceStore.isRacing && raceStore.currentRound > 0 && !raceStore.isRaceComplete)
    return `Round ${raceStore.currentRound} is finished.\n Press START for the next round!`
  return null
})

function progressPercent(horseId: number): number {
  const progress = raceStore.raceProgress[horseId] ?? 0
  const distance = raceStore.currentRoundData?.distance ?? 1
  return Math.min((progress / distance) * 100, 100)
}
</script>

<style scoped lang="scss">
.race-tracking {
  position: relative;
  min-width: 300px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  &.race-tracking-placeholder {
    overflow: hidden;
  }
}

.race-tracking-lane {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid var(--border-color);
  padding: 4px 8px;
  height: 70px;
  .number {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    min-height: 60px;
    height: 100%;
    color: var(--color-white);
    z-index: 1;

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
    padding-left: 60px;
  }

  .horse {
    position: relative;
    transition: left 0.3s linear;
    transform: translateX(-100%);
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

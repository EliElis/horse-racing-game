<template>
  <header class="header container">
    <h1 class="title">Horse Racing</h1>
    <div class="header-buttons">
      <button
        v-if="!raceStore.isScheduleGenerated"
        class="button button-success"
        @click="raceStore.generateSchedule()"
      >
        Generate schedule
      </button>
      <button v-else class="button button-danger" @click="raceStore.resetRace()">
        Reset Race
      </button>
      <button
        v-if="raceStore.isRacing && !raceStore.isPaused"
        class="button button-warning"
        @click="raceStore.pauseRace()"
      >
        Pause
      </button>
      <button
        v-else
        class="button button-success"
        :disabled="!raceStore.isScheduleGenerated || raceStore.isRaceComplete"
        @click="raceStore.startRace()"
      >
        Start
      </button>
    </div>
  </header>

  <main class="main container">
    <HorseList class="aside-left card" />
    <RaceTracking class="main-content" />

    <aside class="aside-right">
      <RaceSchedule />
      <RaceResults />
    </aside>
  </main>
</template>

<script setup lang="ts">
import HorseList from '@/components/HorseList.vue'
import RaceSchedule from '@/components/RaceSchedule.vue'
import RaceTracking from '@/components/RaceTracking.vue'
import RaceResults from '@/components/RaceResults.vue'
import { useHorsesStore } from '@/stores/horses'
import { useRaceStore } from '@/stores/race.ts'

const horsesStore = useHorsesStore()
const raceStore = useRaceStore()
horsesStore.initializeHorses()
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  background-color: var(--color-white);
  border-bottom: 1px solid var(--border-color);
  padding-top: 12px;
  padding-bottom: 12px;
  z-index: 10;
  .title {
    margin-bottom: 0;
  }
  .header-buttons {
    display: flex;
    gap: 12px;
  }
}

.main {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  height: calc(100dvh - var(--header-height));
  max-height: calc(100dvh - var(--header-height));
  gap: 16px;
  padding: 24px;
  overflow: hidden;
}

.main-content {
  max-width: 850px;
  width: 46%;
  overflow: auto;
}

.aside-left {
  min-width: 310px;
  width: 24%;
  overflow: auto;
}

.aside-right {
  display: flex;
  width: 28%;
  gap: 16px;
}
</style>

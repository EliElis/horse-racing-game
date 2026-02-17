<template>
  <header class="header container">
    <div class="header-logo">
      <img src="@/assets/img/svg/logo.svg" alt="Horse Racing" class="logo" />
      <h1 class="title">Horse Racing</h1>
    </div>
    <div class="header-buttons">
      <button
        v-if="!raceStore.isScheduleGenerated"
        class="button button-success"
        @click="raceStore.generateSchedule()"
      >
        Generate schedule
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
      <button v-if="raceStore.isScheduleGenerated" class="button button-danger" @click="raceStore.resetRace()">
        Reset Race
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

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--header-height);
  background-color: var(--color-white);
  border-bottom: 1px solid var(--border-color);
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 10;
  @media (max-width: $breakpoint-lg) {
    position: sticky;
    top: 0;
  }
  .header-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo {
    height: 40px;
    width: auto;
  }
  .title {
    margin-bottom: 0;
  }
  .header-buttons {
    display: flex;
    gap: 12px;
  }
}

.main {
  display: grid;
  grid-template-columns: minmax(310px, 1fr) minmax(0, 2fr) minmax(0, 1.2fr);
  align-items: start;
  gap: 16px;
  height: calc(100dvh - var(--header-height));
  max-height: calc(100dvh - var(--header-height));
  padding: 24px;
  overflow: hidden;
}

.main-content {
  overflow: auto;
}

.aside-left {
  max-height: calc(100dvh - var(--header-height) - 60px);
  overflow: auto;
}

.aside-right {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: start;
  min-width: 0;
  max-height: calc(100dvh - var(--header-height) - 48px);
  overflow-y: auto;
}

@media (max-width: $breakpoint-lg) {
  .main {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    height: auto;
    max-height: none;
    overflow-y: auto;
  }

  .aside-right {
    grid-column: 1 / -1;
    max-height: none;
  }
}

@media (max-width: $breakpoint-md) {
  .header {
    flex-wrap: wrap;
    gap: 8px;
    height: auto;
    .title {
      font-size: 20px;
    }
    .header-buttons {
      gap: 8px;
    }
  }

  .main {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
    overflow-y: auto;
    padding: 16px;
  }

  .aside-right {
    max-height: none;
  }
}

@media (max-width: $breakpoint-sm) {
  .header {
    padding-left: 12px;
    padding-right: 12px;
    .header-buttons {
      width: 100%;
      justify-content: space-between;
    }
  }

  .main {
    padding: 12px;
    gap: 12px;
  }
}
</style>

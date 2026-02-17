<template>
  <header class="header container">
    <div class="header-logo">
      <img src="@/assets/img/svg/logo.svg" alt="Horse Racing" class="logo" />
      <h1 class="title">Horse Racing</h1>
    </div>
    <div class="header-buttons">
      <button
        v-if="!raceStore.isScheduleGenerated"
        data-testid="generate-schedule"
        class="button button-success"
        @click="raceStore.generateSchedule()"
      >
        Generate schedule
      </button>
      <button
        v-if="raceStore.isRacing && !raceStore.isPaused"
        data-testid="pause-race"
        class="button button-warning"
        @click="raceStore.pauseRace()"
      >
        Pause
      </button>
      <button
        v-else
        data-testid="start-race"
        class="button button-success"
        :disabled="!raceStore.isScheduleGenerated || raceStore.isRaceComplete"
        @click="raceStore.startRace()"
      >
        Start
      </button>
      <button
        v-if="raceStore.isScheduleGenerated"
        data-testid="reset-race"
        class="button button-danger"
        @click="raceStore.resetRace()"
      >
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
import { useRaceStore } from '@/stores/race'

const horsesStore = useHorsesStore()
const raceStore = useRaceStore()
horsesStore.initializeHorses()
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.header {
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--header-height);
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--border-color);

  .header-logo {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .logo {
    width: auto;
    height: 40px;
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
  gap: 16px;
  align-items: start;
  height: var(--content-height);
  max-height: var(--content-height);
  padding: 24px;
  overflow: hidden;
}

.main-content {
  overflow: auto;
}

.aside-left {
  max-height: var(--content-height-padded);
  overflow: auto;
}

.aside-right {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: start;
  min-width: 0;
  max-height: var(--content-height-padded);
  overflow-y: auto;
}

@media (max-width: $breakpoint-lg) {
  .header {
    position: sticky;
    top: 0;
  }

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
    padding: 16px;
    overflow-y: auto;
  }

  .aside-left {
    max-height: none;
  }

  .aside-right {
    max-height: none;
  }
}

@media (max-width: $breakpoint-sm) {
  .header {
    justify-content: center;
    padding-right: 12px;
    padding-left: 12px;

    .header-buttons {
      justify-content: center;
      width: 100%;
    }
  }

  .main {
    gap: 12px;
    padding: 12px;
  }
}
</style>

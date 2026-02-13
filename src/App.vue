<template>
  <div class="app">
    <header class="header">
      <h1 class="title">Horse Racing</h1>
      <div class="header-buttons">
        <button class="button">Generate schedule</button>
        <button class="button">Start</button>
        <button class="button">Stop</button>
      </div>
    </header>

  <main class="main">
    <aside>
      <HorseList/>
    </aside>
    <section>
      <RaceTracking/>
    </section>
    <aside>
      <RaceSchedule/>
      <RaceResults/>
    </aside>

  </main>
  </div>
</template>

<script setup lang="ts">
import HorseList from "@/components/HorseList.vue";
import RaceSchedule from "@/components/RaceSchedule.vue";
import RaceTracking from "@/components/RaceTracking.vue";
import RaceResults from "@/components/RaceResults.vue";
import { useHorsesStore } from '@/stores/horses'

const horsesStore = useHorsesStore()
horsesStore.initializeHorses()
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
}

.main {
  display: flex;
}
</style>

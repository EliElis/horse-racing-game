<template>
  <div class="race-schedule card">
    <h2>Schedule</h2>
    <Transition name="fade" mode="out-in">
      <div v-if="raceStore.isScheduleGenerated">
        <TransitionGroup name="list" tag="div">
          <div v-for="round in raceStore.schedule" :key="round.index">
            <h3>Round: {{ round.index }} - {{ round.distance }}m</h3>
            <SimpleTable :columns="columns" :rows="round.horses">
              <template #position="{ index }">
                {{ index + 1 }}
              </template>
            </SimpleTable>
          </div>
        </TransitionGroup>
      </div>
      <div v-else>
        <p>No schedule yet!</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useRaceStore } from '@/stores/race'
import SimpleTable, { type Column } from '@/components/partials/SimpleTable.vue'

const raceStore = useRaceStore()

const columns: Column[] = [
  { key: 'position', label: '#' },
  { key: 'name', label: 'Name' },
]
</script>

<style scoped>
.race-schedule {
  min-width: 240px;
  max-height: calc(100dvh - var(--header-height) - 48px);
  overflow-y: auto;

  h2 {
    position: sticky;
    top: 0;
    background-color: var(--color-white);
    z-index: 2;
  }

  h3 {
    position: sticky;
    top: 30px;
    background-color: var(--color-white);
    z-index: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>

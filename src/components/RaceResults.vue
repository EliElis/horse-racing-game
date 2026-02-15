<template>
  <div class="card race-results">
    <h2>Results</h2>
    <template v-if="raceStore.results && raceStore.results.length > 0">
      <div v-for="round in raceStore.results" :key="round.index">
        Round: {{ round.index }} Distance: {{ round.distance }}m
        <SimpleTable :columns="columns" :rows="round.positions">
          <template #horse="{ value }">
            {{ (value as Horse).name }}
          </template>
        </SimpleTable>
      </div>
    </template>
    <div v-else>
      <p>No results yet!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRaceStore } from '@/stores/race'
import type { Horse } from '@/stores/horses'
import SimpleTable, { type Column } from '@/components/partials/SimpleTable.vue'

const raceStore = useRaceStore()

const columns: Column[] = [
  { key: 'position', label: '#' },
  { key: 'horse', label: 'Name' },
]
</script>

<style scoped>
.race-results {
  min-width: 240px;
  max-height: calc(100dvh - var(--header-height) - 48px);
  overflow-y: auto;
}
</style>

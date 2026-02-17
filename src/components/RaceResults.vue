<template>
  <div class="card race-results pt-0">
    <h2>Results</h2>
    <template v-if="raceStore.results.length > 0">
      <SimpleAccordion
        :items="raceStore.results as Record<string, unknown>[]"
        item-key="index"
        :active-key="latestResultIndex"
      >
        <template #header="{ item }">
          <span>Round {{ item.index }} ({{ item.distance }}m)</span>
        </template>
        <template #content="{ item }">
          <SimpleTable :columns="columns" :rows="item.positions as Record<string, unknown>[]">
            <template #horse="{ value }">
              {{ (value as Horse).name }}
            </template>
          </SimpleTable>
        </template>
      </SimpleAccordion>
    </template>
    <div v-else>
      <p>No results yet!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRaceStore } from '@/stores/race'
import type { Horse } from '@/stores/horses'
import SimpleTable, { type Column } from '@/components/partials/SimpleTable.vue'
import SimpleAccordion from '@/components/partials/SimpleAccordion.vue'

const raceStore = useRaceStore()

const columns: Column[] = [
  { key: 'position', label: '#' },
  { key: 'horse', label: 'Name' },
]

const latestResultIndex = computed(() => {
  const results = raceStore.results
  return results.length > 0 ? results[results.length - 1]!.index : null
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.race-results {
  min-width: 0;
  max-height: var(--content-height-padded);
  overflow-y: auto;

  @media (max-width: $breakpoint-md) {
    max-height: none;
  }

  h2 {
    position: sticky;
    top: 0;
    z-index: 2;
    padding-top: 8px;
    background-color: var(--color-white);
  }
}
</style>

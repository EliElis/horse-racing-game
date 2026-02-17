<template>
  <div class="race-schedule card pt-0">
    <h2>Schedule</h2>
    <Transition name="fade" mode="out-in">
      <div v-if="raceStore.isScheduleGenerated">
        <SimpleAccordion
          :items="raceStore.schedule as Record<string, unknown>[]"
          item-key="index"
          :active-key="raceStore.currentRound + 1"
        >
          <template #header="{ item }">
            <span>Round {{ item.index }} ({{ item.distance }}m)</span>
          </template>
          <template #content="{ item }">
            <SimpleTable :columns="columns" :rows="item.horses as Record<string, unknown>[]">
              <template #position="{ index }">
                {{ index + 1 }}
              </template>
            </SimpleTable>
          </template>
        </SimpleAccordion>
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
import SimpleAccordion from '@/components/partials/SimpleAccordion.vue'

const raceStore = useRaceStore()

const columns: Column[] = [
  { key: 'position', label: '#' },
  { key: 'name', label: 'Name' },
]
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.race-schedule {
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

<template>
  <div class="horse-list">
    <div class="horse-list-content">
      <h2 class="horse-list-title">Horse List</h2>
      <SimpleTable title="Horse List" :columns="columns" :rows="horses">
        <template #color="{ value, row }">
          <ColorBox :color="(value as string)" :label="(row.colorName as string)" />
        </template>
      </SimpleTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useHorsesStore } from '@/stores/horses'
import SimpleTable, { type Column } from '@/components/partials/SimpleTable.vue'
import ColorBox from '@/components/partials/ColorBox.vue'

const { horses } = storeToRefs(useHorsesStore())

const columns: Column[] = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'condition', label: 'Condition' },
  { key: 'color', label: 'Color' },
]
</script>

<style scoped>
.horse-list {
  .horse-list-content {
    overflow-y: auto;
    max-height: 100%;
  }

  .horse-list-title {
    position: sticky;
    top: 0;
    padding-left: 8px;
    background-color: var(--color-white);
    z-index: 1;
  }

}
</style>

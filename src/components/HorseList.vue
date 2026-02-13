<template>
  <div>
  <h2>Horse List</h2>
    <Table :columns="columns" :rows="horses">
      <template #color="{ value }">
        <span class="color-box" :style="{ backgroundColor: value as string }" />
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useHorsesStore } from '@/stores/horses'
import Table, { type Column } from '@/components/partials/Table.vue'

const { horses } = storeToRefs(useHorsesStore())

const columns: Column[] = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'condition', label: 'Condition' },
  { key: 'color', label: 'Color' },
]
</script>

<style scoped>
.color-box {
  display: block;
  width: 20px;
  height: 20px;
}
</style>

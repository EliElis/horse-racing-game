<template>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row" :value="row[col.key]" :index="index">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
export interface Column {
  key: string
  label: string
}

defineProps<{
  columns: Column[]
  rows: Record<string, unknown>[]
}>()
</script>

<style scoped>
.table {
  min-width: 200px;

  table {
    width: 100%;

    th,
    td {
      padding: 4px 8px;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      padding-bottom: 10px;
      text-align: left;
    }

    tbody {
      tr {
        background-color: transparent;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f8fafc;
        }

        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="accordion">
    <div v-for="item in items" :key="String(item[itemKey])" class="accordion-item">
      <button
        class="accordion-header"
        :class="{ active: item[itemKey] === activeKey, open: openKeys.has(item[itemKey]) }"
        @click="toggle(item[itemKey])"
      >
        <slot name="header" :item="item">
          {{ item[itemKey] }}
        </slot>
        <svg
          class="accordion-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Transition name="collapse">
        <div v-show="openKeys.has(item[itemKey])" class="accordion-body">
          <slot name="content" :item="item" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  items: Record<string, unknown>[]
  itemKey: string
  activeKey?: string | number | null
}>()

const openKeys = ref<Set<unknown>>(new Set())

function toggle(key: unknown) {
  if (openKeys.value.has(key)) {
    openKeys.value.delete(key)
  } else {
    openKeys.value.add(key)
  }
}

watch(
  () => props.activeKey,
  (key) => {
    if (key !== undefined && key !== null) {
      openKeys.value.clear()
      openKeys.value.add(key)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.accordion-item {
  margin-bottom: 4px;
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
  font-size: 15px;
  font-weight: 600;
  text-transform: initial;
  cursor: pointer;
  background-color: #f1f5f9;
  border: none;
  transition: background-color 0.2s;

  .accordion-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    transition: transform 0.25s ease;
  }

  &.open .accordion-icon {
    transform: rotate(180deg);
  }

  &:hover {
    background-color: #cbd5e1;
  }

  &.active {
    background-color: #e2e8f0;

    &:hover {
      background-color: #cbd5e1;
    }
  }
}

.accordion-body {
  overflow: hidden;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.25s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>

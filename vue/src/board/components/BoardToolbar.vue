<template>
  <div class="board-toolbar">
    <InputSearch
      :placeholder="$t('chart.toolbar.search.placeholder')"
      class="board-search"
      v-model:value="value"
      @search="handleSearch"
      @change="handleChange"
    />
    <!-- 刷新按钮 -->
    <button class="board-refresh" v-if="refresh" @click="$emit('refresh')">{{ $t('chart.toolbar.refresh') }}</button>
    <!-- smooth配置 -->
    <SmoothComponent @smooth="handleSmooth" />
  </div>
</template>

<script setup>
/**
 * @description: 图表看板工具栏
 * @file: BoardToolBar.vue
 * @since: 2024-07-23 14:57:26
 **/

import { InputSearch } from 'ant-design-vue'
import { debounce } from '../utils'
import SmoothComponent from './SmoothComponent.vue'
import { useBoardStore } from '../store'
defineProps({
  refresh: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['refresh', 'filter'])

// ---------------------------------- 搜索 ----------------------------------

const value = ref('')

const handleSearch = () => {
  emits('filter', value.value)
}

const handleChange = () => {
  emits('filter', value.value)
}

// ---------------------------------- 刷新 ----------------------------------

// ---------------------------------- 平滑 ----------------------------------
const boardStore = useBoardStore()

/**
 * @type {import('./SmoothComponent.vue').SmoothEmit}
 */
const handleSmooth = (detail, param) => {
  debounceUpdateSmoothInfo(detail, param)
}

const debounceUpdateSmoothInfo = debounce(
  /**
   * @type {import('./SmoothComponent.vue').SmoothEmit}
   */
  (detail, param) => {
    boardStore.$smooth = { detail, value: param }
  },
  300
)
</script>

<style lang="scss" scoped>
.board-toolbar {
  @apply border-b sticky top-0 bg-higher flex px-4 py-3;
  @apply items-center justify-between;
  @apply md:flex hidden;
  z-index: 999;
}

// 搜索框样式配置
.board-search {
  .ant-input-search-button {
    display: flex !important;
  }
}

.board-refresh {
  @apply bg-opacity-75 px-2 rounded py-0.5;
  @apply text-warning-dimmer border-warning-dimmest border;
  @apply hover:ring-warning-dimmest hover:ring-1;
}
</style>

<style lang="scss">
.board-search {
  @apply max-w-60;
  .ant-input-search-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<template>
  <div class="board-toolbar">
    <InputSearch
      :placeholder="$t('chart.toolbar.search.placeholder')"
      class="board-search"
      v-model:value="value"
      @search="handleSearch"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
/**
 * @description: 图表看板工具栏
 * @file: BoardToolBar.vue
 * @since: 2024-07-23 14:57:26
 **/
import * as S from '../smooth'
import { InputSearch } from 'ant-design-vue'

const props = defineProps({
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
</script>

<style lang="scss" scoped>
.board-toolbar {
  @apply border-b sticky top-0 bg-higher flex px-4 py-3;
  z-index: 999;
}

// 搜索框样式配置
.board-search {
  .ant-input-search-button {
    display: flex !important;
  }
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

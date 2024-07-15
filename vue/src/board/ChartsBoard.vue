<template>
  <section>
    <div class="chart-header">
      <div class="w-60 mr-2">
        <SLSearch :placeholder="$t('chart.search.placeholder')" reverse @search="search" @input="search" />
      </div>
      <SLButton theme="primary" class="px-3 py-1 rounded-lg">顺滑 </SLButton>
    </div>
    <SectionPuzzle :section="section" v-for="section in sections" :key="section.index" />
  </section>
</template>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/
import SLButton from '@swanlab-vue/components/SLButton.vue'
import SLSearch from '@swanlab-vue/components/SLSearch.vue'
import SectionPuzzle from './puzzle/SectionPuzzle.vue'
import { useBoardStore } from './store'

/**
 * @type {Object} Props
 * @property {Section[]} sections
 * @property {Chart[]} charts
 */
const props = defineProps(['sections', 'charts'])

const boardStore = useBoardStore()

/**
 * 用 props 还是用 store
 */
const sections = computed(() => props.sections)

onMounted(() => {
  boardStore.init(props.sections, props.charts)
})
// ---------------------------------- 搜索相关 ----------------------------------

const search = (value) => {
  console.log(value)
}
</script>

<style lang="scss" scoped>
.chart-header {
  @apply border-b px-6 py-3 flex justify-between;
}
</style>

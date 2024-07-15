<template>
  <Collapse v-model:activeKey="activeKeys" ghost>
    <SectionPuzzle
      v-for="section in showSections"
      :key="section.index"
      :section="section"
      :charts="filterChartsBySection(section)"
    />
  </Collapse>
</template>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/
import { Collapse } from 'ant-design-vue'
import SectionPuzzle from './puzzle/SectionPuzzle.vue'

/**
 * @type {{sections: Section[], charts: Chart[]}} Props
 */
// @ts-ignore
const props = defineProps(['sections', 'charts'])
/**
 * 当前显示在前端的所有图表（包括分页）
 */
const nowCharts = computed(() => {
  return props.charts
})
/**
 * 当前显示的所有section
 */
const showSections = computed(() => {
  return props.sections
})

/**
 * 根据section过滤图表，获取到这个section包含的所有图表
 * @param {Section} section section配置
 */
const filterChartsBySection = (section) => {
  return nowCharts.value.filter((chart) => section.chartIndex.includes(chart.index))
}

// ---------------------------------- 展开/折叠 ----------------------------------

const activeKeys = ref([])
watch(
  () => props.sections,
  () => {
    activeKeys.value = props.sections.filter((s) => !s.folded).map((s) => s.index)
  },
  { immediate: true }
)
</script>

<style lang="scss">
.chart-header {
  @apply border-b px-6 py-3 flex justify-between;
}

.ant-collapse-header {
  align-items: center !important;
}

.ant-collapse-header-text {
  flex: none !important;
  margin-inline-end: unset !important;
  padding-inline-end: 1rem;
  @apply text-base;
}
</style>

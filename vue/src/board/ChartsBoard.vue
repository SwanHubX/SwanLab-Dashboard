<template>
  <section>
    <SectionPuzzle
      v-for="section in nowSections"
      :key="section.index"
      :section="section"
      :charts="filterChartsBySection(section)"
    />
  </section>
</template>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/
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
const nowSections = computed(() => {
  return props.sections
})

/**
 * 根据section过滤图表，获取到这个section包含的所有图表
 * @param {Section} section section配置
 */
const filterChartsBySection = (section) => {
  return nowCharts.value.filter((chart) => section.chartIndex.includes(chart.index))
}
</script>

<style lang="scss" scoped>
.chart-header {
  @apply border-b px-6 py-3 flex justify-between;
}
</style>

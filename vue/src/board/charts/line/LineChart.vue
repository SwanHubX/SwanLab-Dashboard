<template>
  <LineToolBar />
  <LineLayout :captured="chart.captured" :multi="multi">
    <template #legends>
      <LineLegends :legends="legends" :cIndex="chart.index" />
    </template>
    <template #chart>
      <g2-line :chart="chart" :zoom="zoom" :multi="multi" ref="g2LineRef" />
    </template>
  </LineLayout>
</template>

<script setup>
/**
 * @description: 折线图表组件
 * @file: LineChart.vue
 * @since: 2024-07-14 20:53:33
 **/
import LineToolBar from './components/LineToolBar.vue'
import { useColorFinder, watchMetric } from '../toolkit'
import G2Line from './components/G2Line.vue'
import LineLayout from './components/LineLayout.vue'
import LineLegends from './components/LineLegends.vue'
// ---------------------------------- 渲染函数 ----------------------------------
const render = (/** @type {ScalarData[]} */ scalars) => {
  g2LineRef.value.render(scalars)
}

const { multi, zoom, chart } = watchMetric(render)

// ---------------------------------- 其他 ----------------------------------

/** 颜色查找器 */
const colorFinder = useColorFinder(chart.value, multi)
provide('ColorFinder', colorFinder)

const metrics = computed(() => {
  return chart.value.metrics.filter((metric) => metric.column.class !== 'SYSTEM')
})

const g2LineRef = ref(null)

// ---------------------------------- 图例配置 ----------------------------------
/** @type {ComputedRef<import('./components/LineLegends.vue').LineLegends>} */
const legends = computed(() => {
  return {
    captured: chart.value.captured,
    /** @type {import('./components/LineLegends.vue').LineLegend[]} */
    legends: metrics.value.map((m) => {
      return {
        name: m.name,
        expId: m.expId,
        color: colorFinder({ key: m.column.key, experimentId: m.expId })
      }
    })
  }
})
</script>

<style lang="scss" scoped></style>

<template>
  <ChartToolBar :chart="chart" />
  <LineLayout :captured="props.chart.captured" :multi="multi">
    <template #legends>
      <LineLegends :legends="legends" :cIndex="chart.index" />
    </template>
    <template #chart>
      <g2-line :chart="chart" :colorFinder="colorFinder" :zoom="zoom" :multi="multi" ref="g2LineRef" />
    </template>
  </LineLayout>
</template>

<script setup>
/**
 * @description: 折线图表组件
 * @file: LineChart.vue
 * @since: 2024-07-14 20:53:33
 **/
import ChartToolBar from '../.components/ChartToolBar.vue'
import { useColorFinder, watchMetric } from '../toolkit'
import G2Line from './components/G2Line.vue'
import LineLayout from './components/LineLayout.vue'
import LineLegends from './components/LineLegends.vue'
const props = defineProps({
  /** 图表配置 */
  chart: {
    /** @type {PropType<Chart>} */
    type: Object,
    required: true
  },
  /** 图表数据 */
  metricsData: {
    /** @type {PropType< ScalarData[]>} */
    type: [Array, null],
    required: true
  },
  /** 是否为放大环境 */
  zoom: {
    type: Boolean,
    default: true
  },
  /** 是否为多实验图表环境 */
  multi: {
    type: Boolean,
    default: false
  }
})

/** 颜色查找器 */
const colorFinder = useColorFinder(props.chart, props.multi)

const metrics = computed(() => {
  return props.chart.metrics.filter((metric) => metric.column.class !== 'SYSTEM')
})

const g2LineRef = ref(null)
// ---------------------------------- 渲染函数 ----------------------------------
const render = (/** @type {ScalarData[]} */ scalars) => {
  g2LineRef.value.render(scalars)
}

// ---------------------------------- 自动更新逻辑 ----------------------------------
watchMetric(() => props.metricsData, render)

// ---------------------------------- 图例配置 ----------------------------------
/** @type {ComputedRef<import('./components/LineLegends.vue').LineLegends>} */
const legends = computed(() => {
  return {
    captured: props.chart.captured,
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

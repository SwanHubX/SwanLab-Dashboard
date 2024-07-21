<template>
  <ChartToolbar :chart="chart" v-if="!zoom" />
  <g2-line :chart="chart" :colorFinder="colorFinder" :zoom="zoom" ref="g2LineRef" />
</template>

<script setup>
/**
 * @description: 折线图表组件
 * @file: LineChart.vue
 * @since: 2024-07-14 20:53:33
 **/
import ChartToolbar from '../.components/ChartToolbar.vue'
import { useColorFinder, watchMetric } from '../toolkit'
import G2Line from './components/G2Line.vue'
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

const g2LineRef = ref(null)
// ---------------------------------- 渲染函数 ----------------------------------
const render = (/** @type {ScalarData[]} */ scalars) => {
  g2LineRef.value.render(scalars)
}

// ---------------------------------- 自动更新逻辑 ----------------------------------
watchMetric(() => props.metricsData, render)
</script>

<style lang="scss" scoped></style>

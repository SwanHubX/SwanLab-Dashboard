<template>
  <ChartToolbar :chart="chart" v-if="!zoom" />
  <div class="overflow-hidden" ref="g2Ref"></div>
</template>

<script setup>
/**
 * @description: 折线图表组件
 * @file: LineChart.vue
 * @since: 2024-07-14 20:53:33
 **/
import ChartToolbar from '../.components/ChartToolbar.vue'
import { watchMetric } from '../toolkit'
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

/**
 * 操作渲染区域的 DOM 引用
 * @type {Ref<HTMLDivElement>}
 */
const g2Ref = ref(null)
// ---------------------------------- 渲染函数 ----------------------------------
const render = (/** @type {ScalarData[]} */ metricsData) => {}

// ---------------------------------- 自动更新逻辑 ----------------------------------
watchMetric(() => props.metricsData, render)
</script>

<style lang="scss" scoped></style>

<template>
  <ChartToolbar :chart="chart" v-if="toolbar" />
  <div></div>
</template>

<script setup>
/**
 * @description: 折线图表组件
 * @file: LineChart.vue
 * @since: 2024-07-14 20:53:33
 **/
import ChartToolbar from '../.components/ChartToolbar.vue'
import { watch } from 'vue'
/** props */
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
  /** 是否显示toolbar */
  toolbar: {
    type: Boolean,
    default: true
  }
})

watch(
  () => props.metricsData,
  (newVal) => {},
  { immediate: true }
)

// ---------------------------------- 渲染函数 ----------------------------------
const render = (/** @type {ScalarData[]} */ metricsData) => {}
</script>

<style lang="scss" scoped></style>

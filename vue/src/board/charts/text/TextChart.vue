<template>
  <ChartToolBar />
</template>

<script setup>
/**
 * @description: 文本图表组件
 * @file: TextChart.vue
 * @since: 2024-07-14 20:53:41
 **/
import ChartToolBar from '../.components/ChartToolBar.vue'
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
</script>

<style lang="scss" scoped></style>

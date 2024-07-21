<template>image</template>

<script setup>
/**
 * @description: 图片图表组件
 * @file: ImageChart.vue
 * @since: 2024-07-14 20:53:17
 **/
import ChartToolbar from '../.components/ChartToolbar.vue'
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
  }
})
</script>

<style lang="scss" scoped></style>

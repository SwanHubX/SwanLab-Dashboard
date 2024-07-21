<template></template>

<script setup>
import { useScalarProps } from '../toolkit'

/**
 * @description: 图表出现错误字段error
 * @file: ErrorChart.vue
 * @since: 2024-07-20 15:52:47
 **/
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
  /** 是否为放大环境 */
  zoom: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped></style>

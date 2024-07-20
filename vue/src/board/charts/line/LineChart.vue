<template>
  <div></div>
</template>

<script setup>
/**
 * @description: 折线图表组件
 * @file: LineChart.vue
 * @since: 2024-07-14 20:53:33
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
  }
})
</script>

<style lang="scss" scoped></style>

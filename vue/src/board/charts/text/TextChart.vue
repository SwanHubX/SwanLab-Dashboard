<template>text</template>

<script setup>
/**
 * @description: 文本图表组件
 * @file: TextChart.vue
 * @since: 2024-07-14 20:53:41
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
    /** @type {PropType< MediaData[]>} */
    type: [Array, null],
    required: true
  }
})
</script>

<style lang="scss" scoped></style>

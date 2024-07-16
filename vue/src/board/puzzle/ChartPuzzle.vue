<template>
  <div class="w-full bg-white-default border rounded"></div>
</template>

<script setup>
/**
 * @description: 图表拼图容器
 * @file: ChartPuzzle.vue
 * @since: 2024-07-14 20:57:49
 **/
import charts from '@swanlab-vue/board/charts'
/**
 * @typedef {Object} ChartPuzzleProps
 * @property {Chart} chart - 图表配置
 * @property {boolean} draggable - 是否可拖拽，默认不可拖拽
 */

/**
 * @type {ChartPuzzleProps} props
 */
// @ts-ignore
const props = defineProps({
  chart: {
    required: true
  },
  draggable: {
    type: Boolean,
    default: false
  }
})

// 错误信息
const error = computed(() => {
  let e = null
  props.chart.metrics.forEach((metric) => {
    if (metric.column.error) {
      e = metric.column.error
    }
  })
  return e
})
</script>

<style lang="scss" scoped></style>

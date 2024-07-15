<template>
  <div class="w-full">
    <div class="h-6 px-2 flex justify-end items-center text-xs">图表工具</div>
    <!-- 错误 -->
    <div v-if="error">{{ error }}</div>
    <!-- 主体 -->
    <component :is="charts[chart.type.toLocaleLowerCase()]" v-else></component>
    <!-- 放大 -->
    <div v-if="false">
      <component :is="charts[chart.type.toLocaleLowerCase()]"></component>
    </div>
  </div>
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

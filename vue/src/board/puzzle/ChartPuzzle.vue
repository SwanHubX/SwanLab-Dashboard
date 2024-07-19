<template>
  <div class="w-full h-full bg-white-default border rounded relative">
    <ChartWrapper :chart="chart" />
  </div>
</template>

<script setup>
/**
 * @description: 图表拼图容器，关注拖拽逻辑，而不关心具体图表是什么以及里面的状态
 * @file: ChartPuzzle.vue
 * @since: 2024-07-14 20:57:49
 **/
import ChartWrapper from './chart/ChartWrapper.vue'
const props = defineProps({
  /** 图表配置 */
  chart: {
    /** @type {PropType<Chart>} */
    type: Object,
    required: true
  },
  /** 是否可拖拽 */
  draggable: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped></style>

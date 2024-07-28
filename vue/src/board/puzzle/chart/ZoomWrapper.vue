<template>
  <!-- 外部统一设置节点样式 -->
  <div class="text-base">
    <div class="zoom-chart-title">{{ chart.title }}</div>
    <div class="zoom-chart-content">
      <component :is="chartComponent.chart" />
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 放大图表包装器，与普通图表的区别在于放大图表直接使用传入的chart和数据完成渲染，而不再考虑获取数据的逻辑
 * 我们认为进入此组件的数据已经是完整并且正确的
 * @file: ZoomWrapper.vue
 * @since: 2024-07-28 17:08:20
 **/
import { useBoardStore } from '@swanlab-vue/board/store'
import charts from './charts'
const props = defineProps({
  /** 图表配置 */
  chart: {
    /** @type {PropType<Chart>} */
    type: Object,
    required: true
  }
})
const boardStore = useBoardStore()

/** @type {ComputedRef<{chart:Component, toolbar:Component}>} */
const chartComponent = computed(() => {
  return charts[props.chart.type.toLowerCase()]
})

const metricsData = computed(() => {
  return boardStore.$zoom?.data
})

provide('Zoom', true)
provide('MetricsData', metricsData)
provide(
  'Chart',
  computed(() => props.chart)
)
</script>

<style lang="scss" scoped>
$chart-title-zoom-height: 8%;

.zoom-chart-title {
  @apply flex items-center justify-center font-semibold py-2;
  @apply text-2xl;
  height: $chart-title-zoom-height;
}

.zoom-chart-content {
  height: calc(100% - #{$chart-title-zoom-height});
}
</style>

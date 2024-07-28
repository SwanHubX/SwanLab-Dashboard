<template>
  <ChartToolBar :chart="chart" no-zoom />
  <div class="flex flex-col justify-center h-full pb-5">
    <Empty :image="simpleImage">
      <template #description>
        <span class="select-none">{{ $t('chart.chart.empty.description') }}</span>
      </template>
    </Empty>
  </div>
</template>

<script setup>
/**
 * @description: 空图表，此时代表图表数据为空
 * @file: EmptyChart.vue
 * @since: 2024-07-28 16:12:42
 **/
import { Empty } from 'ant-design-vue'
import ChartToolBar from '../.components/ChartToolBar.vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
defineProps({
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

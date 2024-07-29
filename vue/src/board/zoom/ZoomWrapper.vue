<template>
  <div class="w-full h-full">
    <div class="zoom-wrapper">
      <!--  这串class与chart目前是一致的 -->
      <div class="h-full w-full relative top-0 left-0 rounded py-4 px-3">
        <div class="zoom-chart-title">{{ chart.title }}</div>
        <div class="zoom-chart-content">
          <component :is="chartComponent.chart" />
        </div>
      </div>
    </div>
    <div class="zoom-modal-footer">
      <div v-tippy="{ content: $t('chart.zoom.tips.edit') }">
        <Button size="large" disabled>{{ $t('chart.zoom.edit') }}</Button>
      </div>
      <Button size="large" class="font-semibold" @click="handleHidden">{{ $t('chart.zoom.close') }}</Button>
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
import { Button } from 'ant-design-vue'
import { useBoardStore } from '@swanlab-vue/board/store'
import charts from '../charts'
const boardStore = useBoardStore()
const chart = computed(() => boardStore.$modal.chart)

/** @type {ComputedRef<{chart:Component, toolbar:Component}>} */
const chartComponent = computed(() => {
  return charts[boardStore.$modal.chart.type.toLocaleLowerCase()]
})

/** @type {ComputedRef<ChartPuzzleModalZoomInfo>} */
const metricsData = computed(() => {
  return boardStore.$modal.zoom
})

provide('Zoom', true)
provide('MetricsData', metricsData)

// ---------------------------------- 关闭 ----------------------------------
const handleHidden = () => {
  boardStore.closeModal()
}
</script>

<style lang="scss" scoped>
$chart-title-zoom-height: 8%;
.zoom-wrapper {
  height: 90%;
  .zoom-chart-title {
    @apply flex items-center justify-center font-semibold py-2;
    @apply text-2xl;
    height: $chart-title-zoom-height;
  }

  .zoom-chart-content {
    height: calc(100% - #{$chart-title-zoom-height});
    @apply text-base;
  }
}
.zoom-modal-footer {
  height: 10%;
  @apply py-4 px-6  bg-higher border-t  rounded-b-lg;
  @apply flex items-center justify-between;
}
</style>

<style lang="scss">
// 通过cl传递给模态框设置样式
.chart-zoom-modal {
  @apply flex justify-center items-center;
  .ant-modal {
    max-width: 80%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    height: calc(80vh);
    padding: 0;
  }
  .ant-modal-body {
    width: 100%;
    height: 100%;
  }
  .ant-modal-footer {
    height: 10%;
    margin-top: 0;
    @apply py-4 px-6  bg-higher border-t  rounded-b-lg;
  }
}
</style>

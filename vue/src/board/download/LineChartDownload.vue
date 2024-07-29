<template>
  <div class="w-full h-full">
    <div class="download-header">
      <h1 class="text-2xl mx-6 font-semibold">{{ title[type] }}</h1>
    </div>
    <div class="download-body"></div>
    <div class="download-footer">
      <Button class="py-2" style="height: auto">{{ btnText[type] }}</Button>
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 折线图下载组件
 * @file: LineChartDownload.vue
 * @since: 2024-07-29 18:07:51
 **/
import charts from '../charts'
import LineChart from '../.charts/line/LineChart.vue'
import { Button } from 'ant-design-vue'
import { useBoardStore } from '../store'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const boardStore = useBoardStore()
/** 标题 */
const title = {
  png: t('chart.download.line.png.title')
}
/** 按钮文字 */
const btnText = {
  png: t('chart.download.line.png.button')
}
const type = computed(() => boardStore.$modal?.download?.type)
provide('MetricsData', boardStore.$modal?.download?.data)
</script>

<style lang="scss" scoped>
$download-header-height: 13%;
$download-footer-height: 13%;
.download-header {
  height: $download-header-height;
  @apply border-b flex items-center;
}
.download-body {
  height: calc(100% - #{$download-header-height} - #{$download-footer-height});
}
.download-footer {
  height: $download-footer-height;
  @apply bg-higher border-t flex items-center justify-end px-6;
}
</style>

<style lang="scss">
// 通过cl传递给模态框设置样式
.line-download-modal {
  @apply flex justify-center items-center;
  .ant-modal {
    max-width: 60%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    height: calc(60vh);
    padding: 0;
    @apply overflow-hidden;
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

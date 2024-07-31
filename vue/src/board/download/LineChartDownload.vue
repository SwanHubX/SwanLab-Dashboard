<template>
  <div class="w-full h-full">
    <div class="download-header">
      <h1 class="text-2xl mx-6 font-semibold">{{ title[type] }}</h1>
    </div>
    <div class="download-body">
      <!-- 调节大小部分 -->
      <div class="adjust-panel">
        <div class="panel-item">
          {{ $t('chart.download.panel.name') }}
          <Input v-model:value="name" style="width: 150px" :placeholder="placeholder" />
        </div>
        <div class="panel-item">
          {{ $t('chart.download.panel.width') }}
          <InputSlider v-model="width" min="300" max="1200" />
        </div>
        <div class="panel-item">
          {{ $t('chart.download.panel.height') }}
          <InputSlider v-model="height" min="200" max="900" />
        </div>
      </div>
      <!-- 展示部分 -->
      <div class="show-container">
        <div class="mx-auto" :style="{ width: width + 'px', height: height + 'px' }">
          <!-- 标题 -->
          <div class="show-title">
            <h1 class="text-center w-full text-base font-semibold">{{ boardStore.$modal.chart.title }}</h1>
          </div>
          <!-- 图表 -->
          <div class="show-chart">
            <LineChart />
          </div>
        </div>
      </div>
    </div>
    <div class="download-footer">
      <Button class="py-2" style="height: auto" @click="handleDownload">{{ btnText[type] }}</Button>
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 折线图下载组件
 * @file: LineChartDownload.vue
 * @since: 2024-07-29 18:07:51
 **/
import LineChart from '../.charts/line/LineChart.vue'
import { Button, Input } from 'ant-design-vue'
import { useBoardStore } from '../store'
import { useI18n } from 'vue-i18n'
import InputSlider from './components/InputSlider.vue'
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

const metricsData = computed(() => boardStore.$modal.download.data)

const type = computed(() => boardStore.$modal?.download?.type)
provide('MetricsData', metricsData)
provide('Zoom', true)

// ---------------------------------- 调整宽高 ----------------------------------
const width = ref(690)
const height = ref(300)

// ---------------------------------- 名称设置 ----------------------------------
const name = ref('')
// SwanLab-Chart_yyy-mm-dd_hh-mm-ss
const placeholder = 'SwanLab-Chart_' + new Date().toLocaleString().replace(/[- :]/g, '_').replace(/\//g, '-')

// ---------------------------------- 下载 ----------------------------------
const handleDownload = () => {
  console.log('下载')
}
</script>

<style lang="scss" scoped>
$download-header-height: 71px;
$download-footer-height: 73px;
.download-header {
  height: $download-header-height;
  @apply border-b flex items-center;
}
.download-body {
  @apply p-6;
  height: calc(100% - #{$download-header-height} - #{$download-footer-height});
}
.download-footer {
  height: $download-footer-height;
  @apply bg-higher border-t flex items-center justify-end px-6;
}

$panel-height: 10%;
$title-height: 30px;
.adjust-panel {
  height: $panel-height;
  @apply flex items-center gap-3 pb-2;
  .panel-item {
    @apply flex items-center gap-2;
  }
}
.show-container {
  // 始终居中
  @apply overflow-auto w-full;
  height: calc(100% - #{$panel-height});
  .show-title {
    height: $title-height;
  }
  .show-chart {
    height: calc(100% - #{$title-height});
  }
}
</style>

<style lang="scss">
// 通过cl传递给模态框设置样式
.line-download-modal {
  .ant-modal {
    max-width: 720px;
    top: 0;
    left: 0;
    padding-bottom: 0;
    margin: 0;
    height: auto;
  }
  .ant-modal-content {
    height: auto;
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

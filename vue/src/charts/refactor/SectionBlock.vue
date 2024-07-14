<template>
  <Row :gutter="[24, 24]" class="row">
    <Col
      :xl="isMedia(chart) ? 24 : 8"
      :lg="isMedia(chart) ? 24 : 12"
      :md="24"
      v-for="chart in charts"
      :key="chart.index"
    >
      <!-- 这里应该放具体图表组件，样式类必须在 col 内部，不然会影响他的固定样式 -->
      <div class="col"></div>
    </Col>
  </Row>
</template>

<script setup>
/**
 * @description: 命名空间相关
 * @file: SectionBlock.vue
 * @since: 2024-07-13 18:54:46
 **/
import { Row, Col } from 'ant-design-vue'
import { useChartStore } from '@swanlab-vue/store'
const chartStore = useChartStore()

const props = defineProps({
  index: {
    type: String,
    required: true
  }
})

const sectionInfo = computed(() => {
  return chartStore.sections.find((s) => s.index === props.index)
})

/**
 * 是否是媒体图
 * @param { Chart } chart 图表
 */
const isMedia = (chart) => {
  return chart.type !== 'LINE'
}
const charts = ref([])
watch(
  () => sectionInfo.value.chartIndex,
  () => {
    let temp = []
    sectionInfo.value.chartIndex.map((i) => {
      temp.push(chartStore.charts.find((c) => c.index === i))
    })
    charts.value = temp
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.row {
  @apply px-4;

  .col {
    @apply w-full h-60 border;
  }
}
</style>

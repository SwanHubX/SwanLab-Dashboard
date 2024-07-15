<template>
  <CollapsePanel :header="section.name" class="panel" v-if="charts.length">
    <template #extra>
      <div class="px-3 py-0.5 border rounded-full text-xs bg-highest grow">
        {{ section.chartIndex.length || 0 }}
      </div>
    </template>
    <Row :gutter="[24, 24]">
      <Col
        v-for="chart in charts"
        :key="chart.index"
        :md="24"
        :lg="isMedia(chart.type) ? 24 : 12"
        :xl="isMedia(chart.type) ? 24 : 8"
      >
        {{ isMedia(chart.type) }}
        <ChartPuzzle :chart="chart" class="border" />
      </Col>
    </Row>
  </CollapsePanel>
</template>

<script setup>
/**
 * @description: section容器组件
 * @file: SectionFlow.vue
 * @since: 2024-07-14 20:54:09
 **/
import { CollapsePanel, Row, Col } from 'ant-design-vue'
import ChartPuzzle from './ChartPuzzle.vue'
/**
 * @type {{section: Section, charts: Chart[]}} Props
 */
// @ts-ignore
const props = defineProps(['section', 'charts'])

const isMedia = (type) => {
  return ['image', 'audio', 'text'].includes(type.toLowerCase())
}
</script>

<style lang="scss" scoped>
.panel {
  @apply w-full border-b py-2 relative;

  &::before {
    @apply w-full border-b border-default absolute bottom-0;
    content: '';
  }
}
</style>

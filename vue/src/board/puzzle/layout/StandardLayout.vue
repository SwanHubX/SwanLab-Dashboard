<template>
  <Row :gutter="[24, 24]">
    <Col
      v-for="chart in charts"
      :key="chart.index"
      :md="24"
      :lg="isMedia(chart.type) ? 24 : 12"
      :xl="isMedia(chart.type) ? 24 : 8"
    >
      <ChartPuzzle :chart="chart" class="border" />
    </Col>
  </Row>
</template>

<script setup>
/**
 * @description: section内部标准布局
 * @file: StandardLayout.vue
 * @since: 2024-07-15 17:09:24
 **/
import { Row, Col } from 'ant-design-vue'
import ChartPuzzle from '../ChartPuzzle.vue'
const props = defineProps(['charts'])

const isMedia = (type) => {
  return ['image', 'audio', 'text'].includes(type.toLowerCase())
}
</script>

<style lang="scss" scoped></style>

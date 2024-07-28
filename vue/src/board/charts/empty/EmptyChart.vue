<template>
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
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>

<style lang="scss" scoped></style>

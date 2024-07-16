<template>
  <div class="w-full h-full bg-white-default border rounded relative">
    <div class="h-full w-full absolute top-0 left-0 bg-white-default rounded">
      <div class="flex items-center justify-center h-full" v-if="state === 'loading'">
        <Spin />
      </div>
      <div class="flex flex-col h-full items-center justify-center gap-2 text-dimmer" v-else-if="state === 'error'">
        <CloseCircleOutlined :style="{ fontSize: '20px' }" />
        <p class="text-xs text-center">{{ $t('chart.chart.error') }}</p>
      </div>
    </div>
    <component :is="charts[chart.type.toLowerCase()]" :chart="chart" @ready="handleReady" />
  </div>
</template>

<script setup>
/**
 * @description: 图表拼图容器
 * @file: ChartPuzzle.vue
 * @since: 2024-07-14 20:57:49
 **/
import charts from '@swanlab-vue/board/charts'
import { onErrorCaptured } from 'vue'
import { Spin } from 'ant-design-vue'
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

// ---------------------------------- 子组件状态处理 ----------------------------------

/**
 * 此图表状态
 * @type {Ref<'loading' | 'error' | 'success'>}
 */
const state = ref('loading')
onErrorCaptured((err) => {
  console.error('出现错误:', err)
  state.value = 'error'
  // 图表内错误不会向上传递
  return false
})

const handleReady = () => {
  state.value = 'success'
}
</script>

<style lang="scss" scoped></style>

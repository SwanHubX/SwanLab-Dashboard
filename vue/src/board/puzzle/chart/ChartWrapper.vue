<template>
  <div class="h-full w-full absolute top-0 left-0 rounded">
    <div class="flex items-center justify-center h-full" v-if="state === 'loading'">
      <Spin />
    </div>
    <div class="flex flex-col h-full items-center justify-center gap-2 text-dimmer" v-else-if="state === 'error'">
      <CloseCircleOutlined :style="{ fontSize: '20px' }" />
      <p class="text-xs text-center">{{ $t('chart.chart.error') }}</p>
    </div>
    <component :is="charts[chart.type.toLowerCase()]" :chart="chart" :metricsData="metricsData" v-else />
  </div>
</template>

<script setup>
/**
 * @description: 图表包装器，让图表本身业务专注于图表展示，而不用关心图表的数据来源
 * @file: ChartWrapper.vue
 * @since: 2024-07-19 21:20:08
 **/
import { onErrorCaptured } from 'vue'
import { Spin } from 'ant-design-vue'
import charts from '@swanlab-vue/board/charts'
import { parseChartMetrics } from './utils'
import Poller from './poller'
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

/** @type {import('@swanlab-vue/board/ChartsBoard.vue').getMediaMetricsRequest | import('@swanlab-vue/board/ChartsBoard.vue').getScalarMetricsRequest} */
const getter = props.chart.type === 'LINE' ? inject('ScalarGetter') : inject('MediaGetter')
/** @type {ComputedRef<Number>} 是否继续轮询 */
const interval = inject('Interval')

/**
 * 此图表的数据
 * @type {import("vue").ShallowRef<null | MetricData[]>}
 */
const metricsData = shallowRef(null)
// ---------------------------------- 处理子组件状态 ----------------------------------
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

// ---------------------------------- metric获取/更新 ----------------------------------

const metrics = parseChartMetrics(props.chart)
const poller = new Poller()

onMounted(() => {
  poller.start(interval, async () => {
    try {
      /** @type {MetricData[]} */
      const msd = []
      for (const m of await getter(metrics.ids)) {
        // 过滤掉没有数据的metric
        if (m.metrics?.length) msd.push(m)
      }
      if (msd.length) metricsData.value = msd
    } catch (e) {
      console.error('获取数据失败:', e)
      state.value = 'error'
    }
  })
})

onUnmounted(() => poller.stop())
</script>

<style lang="scss" scoped></style>

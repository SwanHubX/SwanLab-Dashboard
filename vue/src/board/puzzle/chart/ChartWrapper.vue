<template>
  <div
    class="h-full w-full relative top-0 left-0 rounded py-4 px-3"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="flex items-center justify-center h-full z-10" v-if="state === 'loading'">
      <Spin />
    </div>
    <div class="flex flex-col h-full items-center justify-center gap-2 text-dimmer z-10" v-else-if="state === 'error'">
      <CloseCircleOutlined :style="{ fontSize: '20px' }" />
      <p class="text-xs text-center">{{ $t('chart.chart.error.unknown') }}</p>
    </div>
    <div class="w-full h-full text-base" v-else>
      <!-- 标题 -->
      <div class="chart-title" :class="{ 'zoom-chart-title': zoom }">{{ chart.title }}</div>
      <div class="chart-content" :class="{ 'zoom-chart-content': zoom }">
        <component :is="chartComponent" :chart="chart" :metricsData="metricsData" :zoom="zoom" :multi="multi" />
      </div>
    </div>
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
  },
  /** 是否为放大环境 */
  zoom: {
    type: Boolean,
    default: false
  }
})

const isChartError = computed(() => false)

/** @type {ComputedRef<Component>} */
const chartComponent = computed(() => {
  if (isChartError.value) return charts.error
  return charts[props.chart.type.toLowerCase()]
})

/** @type {import('@swanlab-vue/board/ChartsBoard.vue').MediaMetricsConstructor | import('@swanlab-vue/board/ChartsBoard.vue').ScalarMetricsConstructor} */
const getter = props.chart.type === 'LINE' ? inject('ScalarConstructor') : inject('MediaConstructor')
/** @type {ComputedRef<Number>} 是否继续轮询 */
const interval = inject('Interval')
const multi = inject('Multi')
/**
 * 此图表的数据
 * @type {import("vue").ShallowRef<null | MetricData[]>}
 */
const metricsData = shallowRef(null)
// ---------------------------------- 处理子组件状态 ----------------------------------

/** @type {Ref<'loading' | 'error' | 'success'>} */
const state = customRef((track, trigger) => {
  // 默认为loading状态
  /** @type {'loading' | 'error' | 'success'} */
  let _state = 'loading'
  let timeout = null
  const delay = 500
  return {
    get() {
      track()
      return _state
    },
    /** @param {'loading' | 'error' | 'success'} value */
    set(value) {
      clearTimeout(timeout)
      if (_state === value) return
      // 如果是success状态，延迟一段时间再切换状态，防止闪烁
      if (value != 'success') {
        _state = value
        return trigger()
      }
      timeout = setTimeout(() => {
        _state = value
        trigger()
      }, delay)
    }
  }
})
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
  // 如果图表本身存在error字段，直接显示error图表而不开启轮询和获取数据

  poller.start(interval, async () => {
    try {
      /** @type {MetricData[]} */
      const msd = []
      for (const m of await getter(metrics.ids)) {
        // console.log('获取数据:', m)
        // 过滤掉没有数据的metric
        if (m.metrics?.length) msd.push(m)
      }
      if (msd.length) {
        metricsData.value = msd
        // console.log('获取数据成功:', msd)
        state.value = 'success'
      }
    } catch (e) {
      console.error('获取数据失败:', e)
      state.value = 'error'
    }
  })
})

onUnmounted(() => poller.stop())

// ---------------------------------- toolbar显示逻辑 ----------------------------------
const chartHovering = ref(false)
provide(
  'ShowToolbar',
  computed(() => {
    return !props.zoom && chartHovering.value
  })
)
const handleMouseEnter = () => {
  chartHovering.value = true
}
const handleMouseLeave = () => {
  chartHovering.value = false
}
</script>

<style lang="scss" scoped>
$chart-title-height: 13%;
$chart-title-zoom-height: 8%;
.chart-title {
  @apply flex items-center justify-center font-semibold pb-1 pt-2;
  height: $chart-title-height;
}

.zoom-chart-title {
  @apply text-2xl;
  padding-bottom: 0.5rem !important;
  height: $chart-title-zoom-height !important;
}

.chart-content {
  height: calc(100% - #{$chart-title-height});
}

.zoom-chart-content {
  height: calc(100% - #{$chart-title-zoom-height});
}
</style>

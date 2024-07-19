<template>
  <SectionsWrapper :sections="sections" :charts="nowCharts" />
</template>

<script>
// request后缀代表需等待的事件
// callback后缀代表回调事件，此时不需要等待
/**
 * 更改section展开、收起状态的回调事件
 * @callback foldSectionCallBack
 * @param { IndexId } index - 当前section的index
 * @param { boolean } isFold - 当前section在点击后是否收起
 * @returns { Promise<void>  }
 */

/**
 * 移动图表位置的回调
 * @callback moveChartEventCallback
 * @param { IndexId } index - 当前图表的index
 * @param { 'move' | 'pin' | 'hide' } type - 移动类型，move代表移动，pin代表置顶，hide代表隐藏
 * @returns { Promise<void>  }
 */

/**
 * 获取标量数据的请求
 * @callback getScalarMetricsRequest
 * @param { MetricId[] } metrics - 需要获取的标量数据的id
 * @returns { Promise<ScalarData[]> }
 */

/**
 * 获取媒体数据的请求
 * @callback getMediaMetricsRequest
 * @param { MetricId[] } metrics - 需要获取的媒体数据的id
 * @param { number } [step] - 获取数据的确定步长，为undefined时代表初次获取
 * @returns { Promise<MediaData[]> }
 */

/**
 * 获取某个媒体资源的回调
 * @callback getMediaResourceRequest
 * @param { MetricId } metric - 需要获取的媒体数据的id
 * @param { string } path - 需要获取的媒体资源的路径，为 {@link MediaDetail.data} 中的一个元素
 * @returns {Promise<?>}
 */
</script>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/
import { useBoardStore } from './store'
import SectionsWrapper from './components/SectionsWrapper.vue'

/**
 * @type {Ref<Section[]>} Section配置组
 */
const sections = defineModel('sections')
/**
 * @type {Ref<Chart[]>} Chart配置组
 */
const charts = defineModel('charts')
const props = defineProps({
  /**
   * 获取标量数据的请求依赖
   */
  getScalarMetrics: {
    /** @type { PropType<getScalarMetricsRequest>} */
    // @ts-ignore
    type: Function,
    required: true
  },
  /**
   * 获取媒体数据的请求依赖
   */
  getMediaMetrics: {
    /** @type { PropType<getMediaMetricsRequest>} */
    // @ts-ignore
    type: Function,
    required: true
  },
  /**
   * 获取媒体资源的请求依赖
   */
  getMediaResource: {
    /** @type { PropType<getMediaResourceRequest>} */
    // @ts-ignore
    type: Function,
    required: true
  },
  /**
   * 轮询间隔，单位毫秒
   * 如果为0则不轮询（取消轮询）
   * 目前轮询间隔的更改无法影响到原有轮询设置，需要先取消原有轮询再重新设置
   */
  internal: {
    /** @type {PropType<number>} */
    type: Number,
    default: 5000,
    validator: (/** @type {number} */ v) => v >= 0
  },
  /**
   * 全局是否可拖拽
   */
  draggable: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['fold', 'move'])

// ------------------------- 全局依赖/状态 ----------------------------------

provide('ScalarGetter', props.getScalarMetrics)
provide('MediaGetter', props.getMediaMetrics)
provide('MediaResourceGetter', props.getMediaResource)
provide(
  'Interval',
  computed(() => (props.internal > 0 ? props.internal : 0))
)
provide(
  'Draggable',
  computed(() => props.draggable)
)

// -------------------------------- 搜索 ----------------------------------
/**
 * 当前显示在前端的所有图表（包括分页）
 */
const nowCharts = computed(() => {
  // TODO 搜索过滤
  return charts.value
})

// ---------------------------- 图表置顶/隐藏 ------------------------------

// -------------------------------- 平滑 ----------------------------------
</script>

<style lang="scss"></style>

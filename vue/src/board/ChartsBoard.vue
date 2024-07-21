<template>
  <div :key="boardKey">
    <SectionsWrapper :sections="stagingSections" :charts="nowCharts" />
  </div>
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
 * 跳转到某个实验的回调
 * @callback jumpToExperimentCallback
 * @param { IndexId } index - 当前图表的index
 * @param { IndexId } expId - 需要跳转到的实验的index
 */

/**
 * 移动图表位置的回调
 * 作为'PINNED' | 'HIDDEN' | 'PUBLIC'时，组件内等待事件完成，刷新图表
 * 作为'MOVE'时，组件内直接移动图表位置，该请求仅作为同步后端数据
 * @callback moveChartEventCallback
 * @param {ChartId} cIndex - 图表的唯一标识
 * @param {'PINNED' | 'HIDDEN' | 'PUBLIC' | 'MOVE'} type - 置顶或隐藏或回归正常或移动到其他section的制定位置
 * @param {SectionId} [sIndex] - 当type为MOVE时，需要指定目标section的index
 * @param {Number} [index] - 当type为MOVE时，需要指定移动到目标section的排序
 * @returns { Promise<{sections: Section[], charts: Chart[]}>  }
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

// ---------------------------------- 组件内事件 ----------------------------------
/**
 * @callback moveChartEvent 图表置顶/隐藏/移动等事件
 * @param {ChartId} cIndex - 图表的唯一标识
 * @param {'PINNED' | 'HIDDEN' | 'PUBLIC' | 'MOVE'} type - 置顶或隐藏或回归正常或移动到其他section的制定位置
 * @param {SectionId} [sIndex] - 当type为MOVE时，需要指定目标section的index
 * @param {Number} [index] - 当type为MOVE时，需要指定移动到目标section的排序
 */
/**
 * @callback zoomChatEvent 图表放大事件
 * @returns {void}
 */
</script>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/
import SectionsWrapper from './components/SectionsWrapper.vue'

const refresh = defineModel('refresh', {
  type: Boolean,
  default: false
})

const props = defineProps({
  /**
   * section配置
   */
  sections: {
    /** @type { PropType<Section[]> } */
    type: Array,
    required: true
  },
  /**
   * chart配置
   */
  charts: {
    /** @type { PropType<Chart[]> } */
    type: Array,
    required: true
  },
  /**
   * 图表置顶/隐藏/移动等事件
   */
  moveChartEventCallback: {
    /** @type { PropType<moveChartEventCallback>} */
    // @ts-ignore
    type: Function,
    required: true
  },
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
  interval: {
    /** @type {PropType<number>} */
    type: Number,
    default: 5000,
    validator: (/** @type {number} */ v) => v >= 0
  },
  role: {
    /** @type {PropType<Role>} */
    // @ts-ignore
    type: String,
    default: 'OWNER'
  },
  /**
   * 深色模式
   */
  dark: {
    type: Boolean,
    default: false
  },
  /**
   * 环境标识，cloud环境下会有一些逻辑与本地不一样
   */
  cloud: {
    type: Boolean,
    default: false
  }
})
const stagingSections = ref(props.sections)
const stagingCharts = ref(props.charts)
const boardKey = ref(0)
const emits = defineEmits(['fold', 'jump'])

// ---------------------------------- 刷新 ----------------------------------

// -------------------------------- 搜索 ----------------------------------
/**
 * 当前显示在前端的所有图表（包括分页）
 */
const nowCharts = computed(() => {
  // TODO 搜索过滤
  return stagingCharts.value
})

// ---------------------------- 图表置顶/隐藏 ------------------------------

/**
 * @type {moveChartEvent}
 */
const changeChartPinOrHide = async (cIndex, type) => {
  if (type === 'MOVE') throw new Error('MOVE事件还未完善')

  const { sections, charts } = await props.moveChartEventCallback(cIndex, type)
  stagingSections.value = sections
  stagingCharts.value = charts
  refresh.value = !refresh.value
}
// ---------------------------- 全局平滑配置 -------------------------------

const smooth = ref({})

// ------------------------- 全局依赖/状态 ----------------------------------

provide('ScalarGetter', props.getScalarMetrics)
provide('MediaGetter', props.getMediaMetrics)
provide('MediaResourceGetter', props.getMediaResource)
provide(
  'Interval',
  computed(() => (props.interval >= 0 ? props.interval : 0))
)
provide('Dark', props.dark)
provide('Role', props.role)
provide('ChangeChartPinOrHide', changeChartPinOrHide)
</script>

<style lang="scss"></style>

<template>
  <div :key="boardKey">
    <BoardToolbar :refresh="refresh" @filter="(value) => (filterKey = value)" @refresh="refreshData" />
    <SectionsWrapper :sections="stagingSections" :charts="nowCharts" />
  </div>
</template>

<script>
/**
 * 更改section展开、收起状态的回调事件
 * @callback FoldSectionCallBack
 * @param { IndexId } index - 当前section的index
 * @param { boolean } isFold - 当前section在点击后是否收起
 * @returns { Promise<void>  }
 */

/**
 * 触发 {@link FoldSectionCallBack} 的函数
 * @callback FoldSectionFunction
 * @param { IndexId } index - 当前section的index
 * @param { boolean } isFold - 当前section在点击后是否收起
 * @returns { void }
 */

/**
 * 跳转到某个实验的，需要返回url
 * @callback MetricURIConstructor
 * @param { IndexId } index - 当前图表的index
 * @param { IndexId } expId - 需要跳转到的实验的index
 * @returns { string }
 */

/**
 * 移动图表位置的构造函数，需要返回新的sections和charts
 * 作为'PINNED' | 'HIDDEN' | 'PUBLIC'时，组件内等待事件完成，刷新图表
 * 作为'MOVE'时，组件内直接移动图表位置，该请求仅作为同步后端数据
 * @callback MoveChartConstructor
 * @param {ChartId} cIndex - 图表的唯一标识
 * @param {'PINNED' | 'HIDDEN' | 'PUBLIC' | 'MOVE'} type - 置顶或隐藏或回归正常或移动到其他section的制定位置
 * @param {SectionId} [sIndex] - 当type为MOVE时，需要指定目标section的index
 * @param {Number} [index] - 当type为MOVE时，需要指定移动到目标section的排序
 * @returns { Promise<{sections: Section[], charts: Chart[]}>  }
 */

/**
 * 获取标量数据的构造
 * @callback ScalarMetricsConstructor
 * @param { ColumnId[] } metrics - 需要获取的标量数据的id
 * @returns { Promise<ScalarData[]> }
 */

/**
 * 获取媒体数据的构造
 * @callback MediaMetricsConstructor
 * @param { ColumnId[] } metrics - 需要获取的媒体数据的id
 * @param { number } [step] - 获取数据的确定步长，为undefined时代表初次获取
 * @returns { Promise<MediaData[]> }
 */

/**
 * 获取某个媒体资源的构造
 * @callback MediaResourceConstructor
 * @param { ColumnId } metric - 需要获取的媒体数据的id
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
</script>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/
import { useI18n } from 'vue-i18n'
import SectionsWrapper from './components/SectionsWrapper.vue'
import { useBoardStore } from './store'
import { copyTextToClipboard, formatNumber2SN, isApple } from './utils'
import { message } from 'ant-design-vue'
import BoardToolbar from './components/BoardToolbar.vue'

const refresh = defineModel('refresh', {
  type: Boolean,
  default: false
})
/** @type { Ref<Section[]> } */
const sections = defineModel('sections', {
  type: Array,
  default: () => []
})

/** @type { Ref<Chart[]> } */
const charts = defineModel('charts', {
  type: Array,
  default: () => []
})

const props = defineProps({
  /**
   * 图表置顶/隐藏/移动等事件
   */
  MoveChartConstructor: {
    /** @type { PropType<MoveChartConstructor>} */
    // @ts-ignore
    type: Function,
    required: true
  },
  /**
   * 获取标量数据的请求依赖
   */
  ScalarConstructor: {
    /** @type { PropType<ScalarMetricsConstructor>} */
    // @ts-ignore
    type: Function,
    required: true
  },
  /**
   * 获取媒体数据的请求依赖
   */
  MediaConstructor: {
    /** @type { PropType<MediaMetricsConstructor>} */
    // @ts-ignore
    type: Function,
    required: true
  },
  /**
   * 获取媒体资源的请求依赖
   */
  ResourceConstructor: {
    /** @type { PropType<MediaResourceConstructor>} */
    // @ts-ignore
    type: Function,
    required: true
  },
  /**
   * 获取实验跳转链接的请求依赖
   */
  MetricURIConstructor: {
    /** @type { PropType<MetricURIConstructor>} */
    // @ts-ignore
    type: Function,
    default: () => {}
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
   * 图表标识，多实验/单实验
   */
  multi: {
    type: Boolean,
    default: false
  }
})
const boardStore = useBoardStore()
const stagingSections = ref(sections.value)
const stagingCharts = ref(charts.value)
const boardKey = ref(0)
const emits = defineEmits(['fold'])
// ---------------------------------- 监听cmd + c 或者 ctrl + c事件 ----------------------------------
const { t } = useI18n()
/**
 * 监听复制事件
 * @param {KeyboardEvent} e
 */
const handleKeydown = (e) => {
  // apple cmd + c，其他平台 ctrl + c
  if ((isApple && e.metaKey) || (!isApple && e.ctrlKey)) {
    if (e.key === 'c' && boardStore.$hover) {
      // console.log('复制事件', boardStore.$hover.data)
      let text = ''
      // 每一行为 {name} {格式化后的数据}
      const lineData = [...boardStore.$hover.data]
      lineData.sort((a, b) => b.data - a.data)
      for (const { detail, data } of lineData) {
        text += `${detail.name} ${formatNumber2SN(data)}\n`
      }
      copyTextToClipboard(text, (success) => {
        if (success) {
          message.success(t('chart.copy.success'))
        } else {
          message.error(t('chart.copy.error'))
        }
      })
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// ---------------------------------- 刷新 ----------------------------------

const refreshData = () => {
  // 刷新图表数据，而不是刷新整个组件
  stagingCharts.value = charts.value
  stagingSections.value = sections.value
  refresh.value = false
}

const refreshAll = () => {
  // 强制刷新整个组件
  refreshData()
  boardKey.value++
}

// -------------------------------- 搜索 ----------------------------------

const filterKey = ref('')
/**
 * 当前显示在前端的所有图表（包括分页）
 */
const nowCharts = computed(() => {
  // console.log(filterKey.value)
  // 搜索过滤
  if (!filterKey.value) return stagingCharts.value
  return stagingCharts.value.filter((chart) => chart.title.includes(filterKey.value))
})

// ---------------------------- 图表置顶/隐藏 ------------------------------

/**
 * @type {moveChartEvent}
 */
const changeChartPinOrHide = async (cIndex, type) => {
  if (type === 'MOVE') throw new Error('MOVE事件还未完善')
  const data = await props.MoveChartConstructor(cIndex, type)
  sections.value = data.sections
  charts.value = data.charts
  setTimeout(() => {
    refreshData()
  }, 0)
}

// ------------------------- 全局依赖/状态 ----------------------------------
/** @type {FoldSectionFunction} 折叠触发事件 */
const foldSection = (index, isFold) => emits('fold', index, isFold)
provide('FoldSectionFunction', foldSection)
provide('ScalarConstructor', props.ScalarConstructor)
provide('MediaConstructor', props.MediaConstructor)
provide('ResourceConstructor', props.ResourceConstructor)
provide('MetricURIConstructor', props.MetricURIConstructor)
provide(
  'Interval',
  computed(() => (props.interval >= 0 ? props.interval : 0))
)
provide('Dark', props.dark)
provide('Role', props.role)
provide('ChangeChartPinOrHide', changeChartPinOrHide)
provide('Multi', props.multi)
provide('isApple', isApple)

// ---------------------------------- 暴露 ----------------------------------
defineExpose({
  refresh: refreshData,
  refreshAll
})
</script>

<style lang="scss"></style>

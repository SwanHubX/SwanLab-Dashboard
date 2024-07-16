<template>
  <SectionsWrapper :sections="showSections" :charts="nowCharts" />
</template>

<script>
/**
 * 更改section展开、收起状态的回调
 * @callback foldSection
 * @param { IndexId } index - 当前section的index
 * @param { boolean } isFold - 当前section在点击后是否收起
 * @returns { Promise<void> }
 */

/**
 * 移动图表位置的回调
 * @callback moveChart
 * @param { IndexId } index - 当前图表的index
 * @param { 'move' | 'pin' | 'hide' } type - 移动类型，move代表移动，pin代表置顶，hide代表隐藏
 * @returns { Promise<void>  }
 */

/**
 * 获取标量数据的回调
 * @callback getScalarMetrics
 * @param { MetricDataId[] } metrics - 需要获取的标量数据的id
 * @returns { Promise<ScalarData[]> }
 */

/**
 * 获取媒体数据的回调
 * @callback getMediaMetrics
 * @param { MetricDataId[] } metrics - 需要获取的媒体数据的id
 * @param { number } [step] - 获取数据的确定步长，为undefined时代表初次获取
 * @returns { Promise<MediaData[]> }
 */

/**
 * 获取某个媒体资源的回调
 * @callback getMediaResource
 * @param { MetricDataId } metric - 需要获取的媒体数据的id
 * @param { string } path - 需要获取的媒体资源的路径，为 {@link MediaDetail.data} 中的一个元素
 */
</script>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/
import SectionsWrapper from './components/SectionsWrapper.vue'
const props = defineProps({
  /**
   * section配置
   */
  sections: {
    /** @type { PropType<Section[]>} */
    type: Array,
    required: true
  },
  /**
   * 图表配置
   */
  charts: {
    /** @type  {PropType<Chart[]>} */
    type: Array,
    required: true
  }
})

const emits = defineEmits(['fold', 'move', 'getScalarMetrics', 'getMediaMetrics', 'getMediaResource'])

// ---------------------------------- 搜索逻辑 ----------------------------------

/**
 * 当前显示在前端的所有图表（包括分页）
 */
const nowCharts = computed(() => {
  // TODO 搜索过滤
  return props.charts
})
/**
 * 当前显示的所有section
 */
const showSections = computed(() => {
  return props.sections
})

// ---------------------------------- 平滑逻辑 ----------------------------------
// TODO
</script>

<style lang="scss"></style>

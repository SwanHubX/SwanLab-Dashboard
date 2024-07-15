<template>
  <div ref="layoutRef">
    <!-- 修改图表大小时的展示框 -->
    <div class="chart-preview"></div>
    <div class="relative overflow-hidden" :style="{ height: layoutConfig.height.value + 'px' }">
      <ChartPuzzle
        v-for="(chart, index) in props.charts"
        class="standard-chart"
        :key="chart.index"
        :chart="chart"
        :style="{
          transform: `translate(${getChartTranslateX(index)}px, ${getChartTranslateY(index)}px)`,
          height: `${layoutConfig.rowHeight.value}px`
        }"
      />
    </div>
    <!-- 分页器 -->
    <div class="w-full pt-4 flex justify-end">
      <Pagination class="!text-xs" v-model:current="current" simple :total="50" />
    </div>
  </div>
</template>

<script setup>
/**
 * @description: section内部标准布局
 * @file: StandardLayout.vue
 * @since: 2024-07-15 17:09:24
 **/
import { Pagination } from 'ant-design-vue'
import ChartPuzzle from '../ChartPuzzle.vue'
import transform from 'ant-design-vue/es/_util/cssinjs/transformers/legacyLogicalProperties'
const props = defineProps({
  /**
   * section配置
   */
  section: {
    /** @type { PropType<Section>} */
    type: Object,
    required: true
  },
  /**
   * 图表配置
   */
  charts: {
    /** @type  {PropType<Chart[]>} */
    type: Array,
    required: true
  },
  /**
   * 是否单列
   */
  singleCol: {
    type: Boolean,
    default: false
  },
  /**
   * 图表是否可拖拽
   */
  draggable: {
    type: Boolean,
    default: false
  }
})

/**
 * 每个图表之间的间距, x: 水平间距, y: 垂直间距
 * @typedef {{readonly x: number, readonly y: number}} ChartSpacing
 */

/**
 * section标准布局配置
 * @typedef {Object} SectionStandardLayoutConfig
 * @property {Ref<number>} rowHeight - 当前section的行高，单位像素
 * @property {number} rows - 当前section的行数
 * @property {Ref<number>} cols - 当前section的列数
 * @property {ChartSpacing} spacing - 图表之间的间距，单位像素
 * @property {ComputedRef<number>} height - section容器高度，超出部分将会被隐藏，单位像素
 */

/**
 * 布局容器DOM
 * @type {Ref<HTMLElement>}
 */
const layoutRef = ref(null)
/**
 * 图表容器DOM的监听对象
 * @type {ResizeObserver}
 */
let observer = null

/**
 * @readonly
 * @type { SectionStandardLayoutConfig }
 */
const layoutConfig = {
  rowHeight: ref(props.section.rowHeight),
  rows: 2,
  cols: ref(props.section.cols),
  spacing: {
    x: 16,
    y: 16
  },
  height: computed(() => {
    return (layoutConfig.rows - 1) * layoutConfig.spacing.y + layoutConfig.rows * layoutConfig.rowHeight.value
  })
}

watch(
  () => [props.section.rowHeight, props.section.cols],
  ([rowHeight, cols]) => {
    layoutConfig.rowHeight.value = rowHeight
    layoutConfig.cols.value = cols
  }
)

onMounted(() => {
  observer = new ResizeObserver(() => {})
  observer.observe(layoutRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

/**
 * 当前展示的图表页数
 */
const current = ref(1)

/**
 * 根据 {@link SectionStandardLayoutConfig} 中的行高和列数以及当前图表所在页数下的图表索引计算图表的x轴偏移量
 * @param {number} index - 图表排序索引
 * @returns {number}
 */
const getChartTranslateX = (index) => {}

/**
 * 根据 {@link SectionStandardLayoutConfig} 中的行高和列数以及当前图表所在页数下的图表索引计算图表的y轴偏移量
 *  @param {number} index - 排序图表索引
 * @returns {number}
 */
const getChartTranslateY = (index) => {}
</script>

<style lang="scss" scoped>
.standard-chart {
  @apply absolute transition-all;
}
</style>

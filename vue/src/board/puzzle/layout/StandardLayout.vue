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
          height: `${layoutConfig.row.height.value}px`,
          width: `${layoutConfig.col.width.value}px`
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
 * section列配置
 * @typedef {Object} SectionColumn
 * @property {ComputedRef<number>} width - 列的宽度，单位像素，结合 {@link Section} 设置的列数，以及当前的容器高度，计算列宽度（不包含 {@link ChartSpacing}）
 */

/**
 * section行配置
 * @typedef {Object} SectionRow
 * @property {ComputedRef<number>} height - 行的高度，单位像素，即为 {@link Section} 设置的行高
 * @property {number} count - 行的最大数量
 */

/**
 * section标准布局配置
 * @typedef {Object} SectionStandardLayoutConfig
 * @property {SectionColumn} col - section列配置
 * @property {SectionRow} row - section行配置
 * @property {ChartSpacing} spacing - 图表之间的间距配置，单位像素
 * @property {Ref<number>} width - section容器宽度，单位像素
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
 * @type { SectionStandardLayoutConfig }
 */
const layoutConfig = {
  row: {
    height: computed(() => props.section.rowHeight),
    count: 2
  },
  col: {
    width: computed(() => {
      // 列宽 = (容器宽度 - （列数-1） * 列间距) / 列数
      return (layoutConfig.width.value - (layoutConfig.row.count - 1) * layoutConfig.spacing.x) / props.section.cols
    })
  },
  spacing: {
    x: 16,
    y: 16
  },
  width: ref(0),
  height: computed(
    // 总高度 =（行数-1） * 行间距 + 行数 * 行高
    () => (layoutConfig.row.count - 1) * layoutConfig.spacing.y + layoutConfig.row.count * layoutConfig.row.height.value
  )
}

onMounted(() => {
  observer = new ResizeObserver(() => {
    layoutConfig.width.value = layoutRef.value.clientWidth
  })
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

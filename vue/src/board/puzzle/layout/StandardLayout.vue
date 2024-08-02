<template>
  <div ref="layoutRef">
    <ResizePreview />
    <div class="relative overflow-hidden" :style="{ height: L.height.value + 'px' }" v-if="observerOn">
      <ChartPuzzle
        v-for="(chart, index) in nowCharts"
        class="standard-chart"
        :key="chart.index"
        :chart="chart"
        :style="{
          transform: `translate(${getChartTranslateX(index)}px, ${getChartTranslateY(index)}px)`,
          height: `${L.row.height.value}px`,
          width: `${L.col.width.value}px`
        }"
      />
    </div>
    <!-- 分页器 -->
    <div class="w-full pt-4 flex justify-end">
      <Pagination
        simple
        class="!text-xs"
        v-model:current="current"
        :total="props.charts.length"
        :page-size="chartsNumPerPage"
        v-if="hasPagination"
      />
    </div>
  </div>
</template>

<script>
/**
 * 每个图表之间的间距, x: 水平间距, y: 垂直间距
 * @typedef {{readonly x: number, readonly y: number}} ChartSpacing
 */

/**
 * section列配置
 * @typedef {Object} SectionColumn
 * @property {ComputedRef<number>} width - 列的宽度，单位像素，结合列数设置的列数，以及当前的容器高度，计算列宽度（不包含 {@link ChartSpacing}）
 */

/**
 * section行配置
 * @typedef {Object} SectionRow
 * @property {ComputedRef<number>} height - 行的高度，单位像素，即设置的行高
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
</script>

<script setup>
/**
 * @description: section内部标准布局
 * @file: StandardLayout.vue
 * @since: 2024-07-15 17:09:24
 **/
import { Pagination } from 'ant-design-vue'
import ChartPuzzle from '../ChartPuzzle.vue'
import ResizePreview from './ResizePreview.vue'
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
   * 图表是否不可拖拽
   */
  noDraggable: {
    type: Boolean,
    default: false
  }
})
/**
 * section最大列数
 */
const columnsNum = computed(() => (props.singleCol ? 1 : props.section.cols))

/**
 * section最大行数
 */
const rowsNum = computed(() => 2)

/**
 * section行高
 */
const rowsHeight = computed(() => props.section.rowHeight)

/**
 * 一页section最多多少个图表
 */
const chartsNumPerPage = computed(() => columnsNum.value * rowsNum.value)

/**
 * @type { SectionStandardLayoutConfig }
 */
const L = {
  row: {
    height: computed(() => rowsHeight.value)
  },
  col: {
    width: computed(() => {
      // 列宽 = (容器宽度 - （列数-1） * 列间距) / 列数
      return (L.width.value - (columnsNum.value - 1) * L.spacing.x) / columnsNum.value
    })
  },
  spacing: {
    x: 16,
    y: 16
  },
  width: ref(0),
  height: computed(
    // 如果存在翻页，总高度 =（最大行数-1） * 行间距 + 最大行数 * 行高
    // 如果不存在翻页，总高度 =（当前行数-1） * 行间距 + 当前行数 * 行高
    () => {
      if (hasPagination.value) return (rowsNum.value - 1) * L.spacing.y + rowsNum.value * L.row.height.value
      const nowRows = Math.min(Math.ceil(nowCharts.value.length / columnsNum.value), rowsNum.value)
      return (nowRows - 1) * L.spacing.y + nowRows * L.row.height.value
    }
  )
}

/**
 * 布局容器DOM
 * @type {Ref<HTMLElement>}
 */
const layoutRef = ref(null)

/**
 * 第一次监听到以后，才会触发渲染
 */
const observerOn = ref(false)

/**
 * 图表容器DOM的监听对象
 * @type {ResizeObserver}
 */
const observer = new ResizeObserver(() => {
  // 如果宽度没有变化，不触发渲染
  if (L.width.value === layoutRef.value.clientWidth) return
  // 如果元素被hidden，不触发渲染
  if (layoutRef.value.offsetParent === null) return
  L.width.value = layoutRef.value.clientWidth
  observerOn.value = true
})
onMounted(() => {
  observer.observe(layoutRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

/**
 * 根据 {@link columnsNum} 、 {@link L.spacing} 、 {@link L.col.width} 以及当前图表所在页数下的图表索引计算图表的x轴偏移量
 * @param {number} index - 图表排序索引
 * @returns {number}
 */
const getChartTranslateX = (index) => {
  // 当前图表所在的列数(从0开始)
  const col = index % columnsNum.value
  return col * L.col.width.value + col * L.spacing.x
}

/**
 * 根据 {@link SectionStandardLayoutConfig} 中的行高和列数以及当前图表所在页数下的图表索引计算图表的y轴偏移量
 *  @param {number} index - 排序图表索引
 * @returns {number}
 */
const getChartTranslateY = (index) => {
  // 当前图表所在的行数(从0开始)
  const row = Math.floor(index / columnsNum.value)
  return row * L.row.height.value + row * L.spacing.y
}

// ---------------------------------- 分页配置 ----------------------------------
/**
 * 当前展示的图表页数
 */
const current = ref(1)

/**
 * 是否存在翻页
 */
const hasPagination = computed(() => props.charts.length > chartsNumPerPage.value)

/**
 * 当前页展示的图表
 */
const nowCharts = computed(() => {
  const start = (current.value - 1) * chartsNumPerPage.value
  const end = current.value * chartsNumPerPage.value
  return props.charts.slice(start, end)
})
</script>

<style lang="scss" scoped>
.standard-chart {
  @apply absolute transition-all;
}
</style>

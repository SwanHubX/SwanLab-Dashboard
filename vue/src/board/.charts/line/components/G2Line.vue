<template>
  <!-- 被动触发时设置overflow hidden -->
  <div class="w-full h-full" :class="{ 'overflow-x-clip': boardStore.$hover?.cIndex !== chart.index }">
    <LineTooltip :data="nowData" :c-index="chart.index" :multi="multi" :zoom="zoom" />
    <div class="overflow-hidden w-full h-full" ref="g2Ref"></div>
  </div>
</template>

<script setup>
/**
 * @description: 基于 G2 的折线图表组件
 * @file: G2Line.vue
 * @since: 2024-07-21 23:23:02
 **/
import { useBoardStore } from '@swanlab-vue/board/store'
import * as L from './line'
import LineTooltip from './LineTooltip.vue'

const props = defineProps({
  /** 图表配置 */
  chart: {
    /** @type {PropType<Chart>} */
    type: Object,
    required: true
  },
  /** 是否为放大环境 */
  zoom: {
    type: Boolean,
    default: false
  },
  /** 是否为多实验图表 */
  multi: {
    type: Boolean,
    default: false
  }
})

/** @type {import('../../toolkit').colorFinder} */
const colorFinder = inject('ColorFinder')

/** @type {Ref<HTMLDivElement>} */
const g2Ref = ref(null)

/**
 * @type {Ref<LineData[]>}
 */
const nowData = shallowRef([])
const boardStore = useBoardStore()

/** @type {L.LineChart} */
let plot = null

/** @type {ScalarData[]} */
let scalars = null
/**
 * 渲染函数
 * @param {ScalarData[]} rawData
 */
const render = (rawData) => {
  const smooth = boardStore.$smooth.detail ? boardStore.$smooth : null
  scalars = rawData
  const { data, maps } = L.fmtScalar2Line(rawData, colorFinder, smooth)
  if (!plot)
    plot = L.createLine(
      g2Ref.value,
      data,
      props.chart.index,
      maps,
      props.zoom,
      props.multi,
      (data) => (nowData.value = data)
    )
  else {
    plot.change(data, maps)
  }
}

// ---------------------------------- 监听smooth更改，重新渲染函数 ----------------------------------
watch(
  () => boardStore.$smooth,
  (newVal, oldVal) => {
    // 如果当前detail不存在则不需要渲染
    if (!newVal.detail) return
    // 如果当前type为NULL并且oldVal不为NULL，需要渲染
    if (newVal.detail.type === 'NULL' && oldVal.detail.type !== 'NULL') return render(scalars)
    // 如果当前为NULL，不需要渲染
    if (newVal.detail.type === 'NULL') return
    // 如果当前value不等于detail.range[0]，需要渲染
    if (newVal.value !== newVal.detail.range[0]) return render(scalars)
  }
)

defineExpose({
  render
})
</script>

<style lang="scss" scoped></style>

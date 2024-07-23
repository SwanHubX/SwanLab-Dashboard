<template>
  <!-- 被动触发时设置overflow hidden -->
  <div class="w-full h-full" :class="{ 'overflow-x-clip': boardStore.$line.hoverInfo?.cIndex !== chart.index }">
    <LineTooltip :data="nowData" :c-index="chart.index" />
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
  colorFinder: {
    /** @type {PropType<import('../../toolkit').colorFinder>} */
    // @ts-ignore
    type: Function,
    required: true
  },
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
  }
})

/** @type {Ref<HTMLDivElement>} */
const g2Ref = ref(null)

/**
 * @type {Ref<L.LineData[]>}
 */
const nowData = shallowRef([])
const boardStore = useBoardStore()

/** @type {L.LineChart} */
let plot = null
/**
 * 渲染函数
 * @param {ScalarData[]} scalars
 */
const render = (scalars) => {
  const { data, maps } = L.fmtScalar2Line(scalars, props.colorFinder)
  if (!plot)
    plot = L.createLine(g2Ref.value, data, props.chart.index, maps, props.zoom, (data) => (nowData.value = data))
  else {
    plot.change(data, maps)
  }
}

defineExpose({
  render
})
</script>

<style lang="scss" scoped></style>

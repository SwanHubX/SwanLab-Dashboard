<template>
  <div class="overflow-hidden w-full h-full" ref="g2Ref"></div>
</template>

<script setup>
/**
 * @description: 基于 G2 的折线图表组件
 * @file: G2Line.vue
 * @since: 2024-07-21 23:23:02
 **/
import * as L from './line'

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

onMounted(() => {})

// ---------------------------------- 其他 ----------------------------------
/**
 * 渲染函数
 * @param {ScalarData[]} scalars
 */
const render = (scalars) => {
  const { data, maps } = L.fmtScalar2Line(scalars, props.colorFinder)
  const chart = L.createLine(g2Ref.value, data, props.chart.index, maps, props.zoom)
}

defineExpose({
  render
})
</script>

<style lang="scss" scoped></style>

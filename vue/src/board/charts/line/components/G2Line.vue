<template>
  <div class="overflow-hidden" ref="g2Ref"></div>
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
  // 根据当前chart，生成颜色字典
  const colorDict = {}
  for (const metric of scalars) {
    colorDict[`${metric.experimentId}-${metric.key}`] = props.colorFinder({
      experimentId: metric.experimentId,
      key: metric.key
    })
  }
  const chart = L.createLine(g2Ref.value, scalars, colorDict)
}

defineExpose({
  render
})
</script>

<style lang="scss" scoped></style>

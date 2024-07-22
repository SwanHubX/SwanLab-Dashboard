<template>
  <div></div>
</template>

<script setup>
/**
 * @description: 折线图例组件
 * @file: LineLegends.vue
 * @since: 2024-07-22 13:55:13
 **/
import { RouterLink } from 'vue-router'
/** props */
const props = defineProps({
  legends: {
    /** @type {PropType<LineLegends>} */
    type: Object,
    required: true
  }
})

/** 指标路径跳转生成器 */
const MetricURIConstructor = inject('MetricURIConstructor')

/**
 * @typedef {Object} LineLegend
 * @property {string} name - 指标名称
 * @property {string} expId - 指标所属实验id
 * @property {string} color - 指标颜色
 */

/**
 * @typedef {Object} LineLegends
 * @property {LineLegend[]} legends - 图例列表
 * @property {Number} [captured] - 截取数量，如果为undefined则不截取
 */
</script>

<style lang="scss" scoped></style>

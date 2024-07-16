<template>
  <SectionsWrapper :sections="showSections" :charts="nowCharts" />
</template>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/
import SectionsWrapper from './components/SectionsWrapper.vue'

/**
 * 此时props传递进来的section已经经过过滤，
 * @type {{sections: Section[], charts: Chart[]}} Props
 */
// @ts-ignore
const props = defineProps(['sections', 'charts'])
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
</script>

<style lang="scss"></style>

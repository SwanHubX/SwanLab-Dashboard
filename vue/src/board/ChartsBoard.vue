<template></template>

<script setup>
/**
 * @description: 图表看板，封装图表组件逻辑
 * @file: ChartsBoard.vue
 * @since: 2024-07-14 20:43:37
 **/

/**
 * 需要传入的属性，一个图表看板包含多个section和多个chart
 * @type {{sections: Section[], charts: Chart[]}}
 */
const props = defineProps(['sections', 'charts'])
</script>

<style lang="scss" scoped></style>

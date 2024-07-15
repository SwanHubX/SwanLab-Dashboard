<template>
  <div v-if="charts.length"></div>
</template>

<script setup>
/**
 * @description: section容器组件
 * @file: SectionFlow.vue
 * @since: 2024-07-14 20:54:09
 **/

/**
 * @type {{section: Section, charts: Chart[]}} Props
 */
// @ts-ignore
const props = defineProps(['section', 'charts'])
</script>

<style lang="scss" scoped></style>

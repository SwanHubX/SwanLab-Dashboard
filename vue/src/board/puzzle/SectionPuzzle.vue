<template>
  <div>
    {{ section }}
  </div>
</template>

<script setup>
/**
 * @description: section容器组件
 * @file: SectionFlow.vue
 * @since: 2024-07-14 20:54:09
 **/

/**
 * @type {Object} Props
 * @property {Section[]} sections
 */
const props = defineProps(['section'])
</script>

<style lang="scss" scoped></style>

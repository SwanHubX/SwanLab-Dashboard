<template>image</template>

<script setup>
/**
 * @description: 图片图表组件
 * @file: ImageChart.vue
 * @since: 2024-07-14 20:53:17
 **/
/** props */
const props = defineProps({
  /** 图表配置 */
  chart: {
    /** @type {PropType<Chart>} */
    type: Object,
    required: true
  }
})

const emits = defineEmits(['ready'])
</script>

<style lang="scss" scoped></style>

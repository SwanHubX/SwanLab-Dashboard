<template>audio</template>

<script setup>
/**
 * @description: 音频图表组件
 * @file: AudioChart.vue
 * @since: 2024-07-14 20:53:08
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

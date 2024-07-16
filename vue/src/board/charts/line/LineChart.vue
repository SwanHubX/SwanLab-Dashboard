<template>line</template>

<script setup>
/**
 * @description: 折线图表组件
 * @file: LineChart.vue
 * @since: 2024-07-14 20:53:33
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

onMounted(async () => {
  // 耗时操作
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
  throw new Error('Ops!')
})
</script>

<style lang="scss" scoped></style>

<template>
  <div class="w-full h-full">
    <div class="line-legend-layout">
      <slot name="legends"></slot>
    </div>
    <div class="line-chart-layout">
      <slot name="chart"></slot>
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 主要解决图例与图表的布局问题
 * @file: LineLayout.vue
 * @since: 2024-07-22 14:12:53
 **/

/** props */
const props = defineProps({
  /** 是否为多实验图表环境 */
  multi: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
$line-legend-height: 10%;
.line-legend-layout {
  height: 10%;
  overflow: hidden;
}
.line-chart-layout {
  height: 90%;
  overflow: hidden;
}
</style>

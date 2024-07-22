<template>
  <div class="w-full h-full">
    <!-- 存在截断行为，height改为20%，暂时只有多实验有图例 -->
    <div class="line-legend-layout" :style="{ height: legendHeight }" v-if="multi">
      <slot name="legends"></slot>
    </div>
    <!-- 存在截断行为，height改为80% -->
    <div class="line-chart-layout" :style="{ height: chartHeight }">
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
  multi: {
    type: Boolean,
    default: false
  },
  captured: {
    type: Number,
    default: 0
  }
})
const legendHeight = computed(() => {
  return props.captured ? '20%' : undefined
})
const chartHeight = computed(() => {
  if (!props.multi) return '100%'
  return props.captured ? '80%' : undefined
})
</script>

<style lang="scss" scoped>
// 基础样式
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

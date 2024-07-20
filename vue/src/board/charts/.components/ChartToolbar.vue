<template>
  <div class="chart-toolbar">
    <div class="flex justify-end w-full text-dimmer">
      <PinComponent />
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 图表工具栏，共享部分逻辑，同时满足定制化需求
 * @file: ChartToolbar.vue
 * @since: 2024-07-20 15:14:01
 **/
import { PushpinOutlined, PushpinFilled } from '@ant-design/icons-vue'
/** @type {SectionType} */
const sType = inject('SectionType')
const PinComponent = sType === 'PINNED' ? PushpinFilled : PushpinOutlined

/**
 * 工具栏图标配置属性
 * @typedef {Object} ToolBarIconConfig
 * @property {Component} icon - 图标组件
 * @property {string} tip - 图标提示
 * @property {Function} handler - 图标点击事件
 */
</script>

<style lang="scss" scoped>
.chart-toolbar {
  @apply absolute w-full h-full top-0 left-0 pt-1 pr-2 z-full;
  &:hover {
    .panel {
      @apply flex;
    }
  }
  .panel {
    @apply flex justify-end w-full;
  }
}
</style>

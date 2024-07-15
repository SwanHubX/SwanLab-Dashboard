<template>
  <CollapsePanel :header="section.name" class="panel" v-if="charts.length">
    <template #extra>
      <div class="px-3 py-0.5 border rounded-full text-xs bg-highest grow">
        {{ section.chartIndex.length || 0 }}
      </div>
    </template>
    <!-- 标准布局/可移动布局 -->
    <component :is="layout" :charts="charts"></component>
    <!-- 分页器 -->
    <div class="w-full py-4 flex justify-end"><Pagination v-model:current="current" simple :total="50" /></div>
  </CollapsePanel>
</template>

<script setup>
/**
 * @description: section容器组件
 * @file: SectionFlow.vue
 * @since: 2024-07-14 20:54:09
 **/
import { CollapsePanel, Pagination } from 'ant-design-vue'
import StandardLayout from './layout/StandardLayout.vue'
import MobileLayout from './layout/MobileLayout.vue'
/**
 * @type {{section: Section, charts: Chart[]}} Props
 */
// @ts-ignore
const props = defineProps(['section', 'charts'])

const layout = computed(() => {
  return 0 < props.charts.length ? StandardLayout : MobileLayout
})

const current = ref(1)
</script>

<style lang="scss" scoped>
.panel {
  @apply w-full border-b py-2 relative;

  &::before {
    @apply w-full border-b border-default absolute bottom-0;
    content: '';
  }
}
</style>

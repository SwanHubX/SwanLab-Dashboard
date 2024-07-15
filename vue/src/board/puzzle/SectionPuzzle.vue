<template>
  <CollapsePanel :header="section.name" class="panel" v-if="charts.length">
    <template #extra>
      <div class="px-3 py-0.5 border rounded-full text-xs bg-highest grow">
        {{ section.chartIndex.length || 0 }}
      </div>
    </template>
    <div>{{ section }}</div>
  </CollapsePanel>
</template>

<script setup>
/**
 * @description: section容器组件
 * @file: SectionFlow.vue
 * @since: 2024-07-14 20:54:09
 **/
import { CollapsePanel } from 'ant-design-vue'
/**
 * @type {{section: Section, charts: Chart[]}} Props
 */
// @ts-ignore
const props = defineProps(['section', 'charts'])
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

<template>
  <Collapse v-model:activeKey="activeKeys" ghost>
    <CollapsePanel v-for="section in sections" :key="section.index" :header="section.name" class="panel">
      <template #extra>
        <div class="px-3 py-0.5 border rounded-full text-xs bg-highest">{{ section.chartIndex.length || 0 }}</div>
      </template>
      <SectionBlock :index="section.index" />
    </CollapsePanel>
  </Collapse>
</template>

<script setup>
/**
 * @description: 命名空间布局
 * @file: SectionLayout.vue
 * @since: 2024-07-13 17:23:43
 **/
import { Collapse, CollapsePanel } from 'ant-design-vue'
import { useChartStore } from '@swanlab-vue/store'
import SectionBlock from './SectionBlock.vue'

const chartStore = useChartStore()
const sections = chartStore.sections

// 展开情况
const activeKeys = ref([])
watch(
  chartStore.sections,
  () => {
    activeKeys.value = chartStore.sections.filter((s) => !s.folded).map((s) => s.index)
  },
  { immediate: true }
)
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

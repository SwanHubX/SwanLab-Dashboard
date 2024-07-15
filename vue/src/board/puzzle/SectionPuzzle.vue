<template>
  <CollapsePanel class="panel" v-if="charts.length">
    <template #header> {{ sectionName }} </template>
    <template #extra>
      <div class="px-3 py-0.5 border rounded-full text-xs bg-highest grow">
        {{ section.chartIndex.length || 0 }}
      </div>
    </template>
    <!-- 标准布局/可移动布局 -->
    <component :is="nowLayout" :charts="charts" :section="section" />
  </CollapsePanel>
</template>

<script setup>
/**
 * @description: section容器组件
 * @file: SectionFlow.vue
 * @since: 2024-07-14 20:54:09
 **/
import { CollapsePanel } from 'ant-design-vue'
import StandardLayout from './layout/StandardLayout.vue'
import MobileLayout from './layout/MobileLayout.vue'
import { t } from '@swanlab-vue/i18n'
/**
 * @type {{section: Section, charts: Chart[]}} Props
 */
// @ts-ignore
const props = defineProps(['section', 'charts'])

/**
 * 此section的名称，对某些特殊名称需要特殊处理
 */
const sectionName = computed(() => {
  const name = props.section.name
  if (['default', 'Image', 'Audio', 'Text', 'Media', 'pinned', 'hidden'].includes(name))
    return t(`chart.section.name.${name}`)
  return name
})

const nowLayout = shallowRef(StandardLayout)
</script>

<style lang="scss" scoped>
.panel {
  @apply w-full border-b py-2 relative;

  &:not(:last-child)::before {
    @apply w-full border-b border-default absolute bottom-0;
    content: '';
  }
}
</style>

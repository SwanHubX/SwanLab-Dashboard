<template>
  <section class="section">
    <!-- 控制栏 -->
    <div class="controller">
      <!-- 关闭、展开按钮 -->
      <button @click="isFold = !isFold">
        <SLIcon icon="down" class="icon" :class="{ '-rotate-90': isFold }" />
        {{ sectionName }}
        <span class="count">{{ charts.length || 0 }}</span>
      </button>
      <!-- 中间其他操作区 -->
      <div class="grow"></div>
      <!-- 添加图表的按钮 -->
    </div>
    <component :is="nowLayout" :charts="charts" :section="section" v-show="!isFold" />
  </section>
</template>

<script setup>
/**
 * @description: section容器组件
 * @file: SectionFlow.vue
 * @since: 2024-07-14 20:54:09
 **/
import StandardLayout from './layout/StandardLayout.vue'
import MobileLayout from './layout/MobileLayout.vue'
import SLIcon from '@swanlab-vue/components/SLIcon.vue'
import { t } from '@swanlab-vue/i18n'

const props = defineProps({
  /**
   * section配置
   */
  section: {
    /** @type { PropType<Section>} */
    type: Object,
    required: true
  },
  /**
   * 图表配置
   */
  charts: {
    /** @type  {PropType<Chart[]>} */
    type: Array,
    required: true
  },
  /**
   * 是否强制使用移动端布局
   */
  mobile: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['fold-change'])

const nowLayout = computed(() => (props.mobile ? MobileLayout : StandardLayout))

// ---------------------------------- 折叠布局相关 ----------------------------------

/**
 * 此section的名称，对某些特殊名称需要特殊处理
 */
const sectionName = computed(() => {
  const name = props.section.name
  if (['default', 'Image', 'Audio', 'Text', 'Media', 'pinned', 'hidden'].includes(name))
    return t(`chart.section.name.${name}`)
  return name
})

const isFold = ref(props.section.folded)

watch(
  () => isFold.value,
  (v) => emits('fold-change', props.section.index, v)
)
</script>

<style lang="scss" scoped>
.section {
  @apply w-full border-b py-2 relative px-4;

  &:last-child {
    @apply border-none;
  }
}

.controller {
  @apply flex items-center px-4 py-2;

  button {
    @apply flex items-center gap-1 relative;
  }

  .icon {
    @apply w-6 h-6 absolute -left-6 transition-all;
  }

  .count {
    @apply px-3 bg-highest text-sm rounded-full ml-2;
  }
}
</style>

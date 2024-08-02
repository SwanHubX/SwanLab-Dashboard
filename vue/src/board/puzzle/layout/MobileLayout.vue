<template>
  <StandardLayout :section="props.section" :charts="props.charts" no-draggable single-col />
</template>

<script setup>
/**
 * @description: section内部移动端布局
 * @file: MobileLayout.vue
 * @since: 2024-07-15 17:09:47
 **/
import StandardLayout from './StandardLayout.vue'
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
  }
})
</script>

<style lang="scss" scoped></style>

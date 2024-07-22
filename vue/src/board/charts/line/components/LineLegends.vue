<template>
  <div class="w-full h-full">
    <p class="text-dimmest text-xs text-center h-5" v-if="legends.captured">
      {{ $t('chart.chart.limit.title', { count: legends.captured }) }}
    </p>
    <div class="legends-content" :style="{ height: legends.captured ? 'calc(100% - 1.25rem)' : '100%' }">
      <div v-for="(legend, index) in legends.legends" :key="index" class="legend-item" :style="{ color: legend.color }">
        <RouterLink :to="MetricURIConstructor(cIndex, legend.expId)">
          {{ legend.name }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 折线图例组件
 * @file: LineLegends.vue
 * @since: 2024-07-22 13:55:13
 **/
import { RouterLink } from 'vue-router'
/** props */
const props = defineProps({
  /** chart index */
  cIndex: {
    type: String,
    required: true
  },
  legends: {
    /** @type {PropType<LineLegends>} */
    type: Object,
    required: true
  }
})

/** 指标路径跳转生成器 */
const MetricURIConstructor = inject('MetricURIConstructor')

/**
 * @typedef {Object} LineLegend
 * @property {string} name - 指标名称
 * @property {string} expId - 指标所属实验id
 * @property {string} color - 指标颜色
 */

/**
 * @typedef {Object} LineLegends
 * @property {LineLegend[]} legends - 图例列表
 * @property {Number} [captured] - 截取数量，如果为undefined则不截取
 */
</script>

<style lang="scss" scoped>
.legends-content {
  @apply overflow-y-auto flex flex-wrap justify-center;
  @apply gap-y-0.5 gap-x-4;
}

.legend-item {
  @apply flex flex-shrink-0 items-center hover:brightness-75 text-xs leading-none;
  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 2px;
    margin-top: 2px;
    margin-right: 4px;
    background-color: currentColor;
  }
}
</style>

<template>
  <div class="w-full relative" ref="toolTipContainerRef">
    <div class="lc-tooltip" ref="toolTipRef" v-show="show" :style="style">
      <div class="lc-tooltip-item" v-for="item in data" :key="item.series" :style="{ color: item.detail.color }">
        <!-- 颜色 -->
        <span class="lc-tooltip-color lc-tooltip-color-rect"></span>
        <!-- 步数 -->
        <span class="lc-tooltip-step">{{ item.index }}</span>
        <!-- 数据 -->
        <span class="lc-tooltip-value">{{ formatNumber2SN(item.data) }}</span>
        <!-- 标签 -->
        <span class="lc-tooltip-tag">{{ item.detail.name }}</span>
      </div>
      <p class="lc-tooltip-tip">{{ 1 }}</p>
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 折线图表提示框组件
 * @file: LineTooltip.vue
 * @since: 2024-07-22 18:25:09
 **/
import { useBoardStore } from '@swanlab-vue/board/store'
import { formatNumber2SN } from '../../toolkit'
defineProps({
  /** 提示框数据 */
  data: {
    /** @type {PropType<import('./line').LineData[]>} */
    type: Array,
    required: true
  }
})
const boardStore = useBoardStore()
const toolTipContainerRef = ref(null)
const toolTipRef = ref(null)
const sIndex = inject('SectionIndex')

const show = computed(
  () =>
    boardStore.$line.hoverInfo !== null &&
    boardStore.$line.hoverInfo?.sIndex === sIndex &&
    toolTipContainerRef.value?.offsetWidth
)
const offset = 20
// 动态计算当前提示框显示位置，主要是left
const style = computed(() => {
  const x = boardStore.$line.hoverInfo?.x
  // console.log('x', x)
  if (!x) return {}
  // if (props.cIndex !== cIndex) return { left: `${x + offset}px` }
  // 如果 x 在容器左边，显示在右边，否则显示在左边
  return {
    left: `${x > toolTipContainerRef.value?.offsetWidth / 2 ? x - 240 - offset : x + offset}px`
  }
})
</script>

<style lang="scss" scoped>
.lc-tooltip {
  @apply py-2 px-3 absolute bg-default border rounded z-10 -top-7;
  min-width: 180px;
  box-shadow: rgba(21, 24, 31, 0.16) 0px 12px 24px 0px;
  visibility: visible;

  p {
    @apply text-xs text-default font-semibold;
  }

  .lc-tooltip-item {
    @apply flex items-center gap-3;
    &:not(:last-child) {
      @apply mb-1.5;
    }

    .lc-tooltip-color {
      @apply w-5 flex items-center flex-shrink-0;
    }

    .lc-tooltip-color-rect {
      &::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 6px;
        border-radius: 2px;
        margin-right: 5px;
        background-color: currentColor;
      }
    }
  }

  .lc-tooltip-tip {
    @apply font-normal text-dimmest text-xs flex-shrink-0;
  }
}

.lc-tooltip-item {
  @apply text-xs;
  .lc-tooltip-step {
    @apply font-semibold flex-shrink-0;
    &::after {
      content: ':';
      @apply font-semibold;
    }
  }

  .lc-tooltip-value {
    @apply text-left font-semibold whitespace-nowrap;
  }

  .lc-tooltip-tag {
    max-width: 100px;
    @apply truncate;
  }
}
</style>

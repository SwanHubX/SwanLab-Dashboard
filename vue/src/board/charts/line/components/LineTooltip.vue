<template>
  <div class="w-full relative" ref="toolTipContainerRef">
    <div class="lc-tooltip" ref="toolTipRef" v-show="show" :style="style">
      <div
        class="lc-tooltip-item"
        :class="{ 'lc-tooltip-item-focus': isFocus(item) }"
        v-for="item in processedData"
        :key="item.series"
        :style="{ color: item.color }"
      >
        <!-- 颜色 -->
        <span class="lc-tooltip-color lc-tooltip-color-rect"></span>
        <!-- 步数 -->
        <span class="lc-tooltip-step">{{ item.index }}</span>
        <!-- 数据 -->
        <span class="lc-tooltip-value">{{ showData(item) }}</span>
        <!-- 标签 -->
        <span class="lc-tooltip-tag">{{ item.name }}</span>
      </div>
      <p class="lc-tooltip-tip" v-if="isManual">
        {{ isApple ? $t('chart.line.tooltip.copy.apple') : $t('chart.line.tooltip.copy.win') }}
      </p>
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
import { U } from '../../toolkit'
import { isApple } from '@swanlab-vue/board/utils'
const props = defineProps({
  cIndex: {
    /** @type {PropType<ChartId>} */
    type: String,
    required: true
  },
  /** 提示框数据 */
  data: {
    /** @type {PropType<import('./line').LineData[]>} */
    type: Array,
    required: true
  },
  /** 是否为多实验图表 */
  multi: {
    type: Boolean,
    default: false
  },
  /** 是否为放大环境 */
  zoom: {
    type: Boolean,
    default: false
  }
})
const boardStore = useBoardStore()
const toolTipContainerRef = ref(null)
const toolTipRef = ref(null)
const sIndex = inject('SectionIndex')

/** 是否为主动触发 */
const isManual = computed(() => boardStore.$hover?.cIndex === props.cIndex)

/**
 * 处理后的数据，此时smooth为平滑后的值，如果未平滑则为undefined
 * @typedef {Object} ProcessedData
 * @property {Number} index 步数
 * @property {String} data 数据
 * @property {String} [smooth] 平滑数据
 * @property {String} name 标签
 * @property {IndexId} series 唯一标识
 * @property {String} experimentId 实验ID
 * @property {String} color 颜色
 */

/**
 * 依据data降序排序（大到小）
 * @type {ComputedRef<ProcessedData[]>}
 */
const processedData = computed(() => {
  /** @type {ProcessedData[]} */
  const pd = []
  for (const item of props.data) {
    // 如果为平滑数据，跳过
    if (item.detail.smooth) {
      continue
    } else {
      // 如果为非平滑数据，找到对应的平滑数据，添加到pd中
      const smoothItem = props.data.find(
        (d) => d.detail.smooth && d.detail.key === item.detail.key && d.detail.experimentId === item.detail.experimentId
      )
      pd.push({
        index: item.index,
        data: U.formatNumber2SN(item.data),
        color: smoothItem?.detail.color ?? item.detail.color,
        smooth: smoothItem ? U.formatNumber2SN(smoothItem.data) : undefined,
        name: item.detail.name,
        series: item.series,
        experimentId: item.detail.experimentId
      })
    }
  }

  return pd
})

const show = computed(
  () =>
    boardStore.$hover !== null &&
    boardStore.$hover?.zoom === props.zoom &&
    boardStore.$hover?.sIndex === sIndex &&
    toolTipContainerRef.value?.offsetWidth
)
const offset = 40
// 动态计算当前提示框显示位置，主要是left
const style = computed(() => {
  const x = boardStore.$hover?.x
  // console.log('x', x)
  if (!x) return {}
  // if (props.cIndex !== cIndex) return { left: `${x + offset}px` }
  // 如果 x 在容器左边，显示在右边，否则显示在左边
  return {
    left: `${x > toolTipContainerRef.value?.offsetWidth / 2 ? x - 250 - offset : x + offset}px`
  }
})

/** 判断是否为焦点，只对多实验图表有效 */
const isFocus = (/** @type {ProcessedData} */ item) => {
  if (!props.multi) return false
  return boardStore.$hover?.detail.experimentId === item.experimentId
}

/** 显示数据 */
const showData = (/** @type {ProcessedData} */ item) => {
  return item.smooth ? `${item.data}  (${item.smooth})` : item.data
}
</script>

<style lang="scss" scoped>
.lc-tooltip {
  @apply py-2 px-2 absolute bg-default border rounded z-10 -top-7;
  min-width: 250px;
  box-shadow: rgba(21, 24, 31, 0.16) 0px 12px 24px 0px;
  visibility: visible;

  p {
    @apply text-xs text-default font-semibold;
  }
  .lc-tooltip-item-focus {
    @apply bg-highest;
  }

  .lc-tooltip-item {
    @apply flex items-center gap-3 px-1 rounded;
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

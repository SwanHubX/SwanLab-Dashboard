<template>
  <div class="chart-toolbar" ref="toolbarRef">
    <div class="panel">
      <button
        v-for="(icon, index) in toolBarIcons"
        :key="index"
        class="toolbar-button"
        :disabled="icon.disabled || icon.loading?.value"
        v-show="icon.show || showToolbar"
        v-tippy="{ content: icon.tip }"
        @click="icon.handler"
      >
        <component
          class="text-xs flex items-center"
          :key="index"
          :is="icon.loading?.value ? LoadingOutlined : icon.icon"
          :style="icon.style"
        />
      </button>
      <!-- 更多 -->
      <div class="relative" v-show="showToolbar">
        <Dropdown class="toolbar-button" v-model:open="open">
          <more-outlined style="transform: rotate(90deg)" />
          <template #overlay>
            <Menu style="width: 120px" @click="handleMenuClick">
              <MenuItem auto-close @click="handleHidden" :disabled="hiddenLoading || disabled">
                <div class="flex items-center gap-3">
                  <!-- 当前在非隐藏列 -->
                  <template v-if="sType !== 'HIDDEN'">
                    <LoadingOutlined v-if="hiddenLoading" />
                    <EyeInvisibleOutlined v-else />
                    {{ $t('chart.chart.toolbar.tips.hide') }}
                  </template>
                  <!-- 当前在隐藏列 -->
                  <template v-else>
                    <LoadingOutlined v-if="hiddenLoading" />
                    <EyeOutlined v-else />
                    {{ $t('chart.chart.toolbar.tips.unHide') }}
                  </template>
                </div>
              </MenuItem>
              <slot name="more" :disabled="disabled" :open="open"></slot>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 图表工具栏，共享部分逻辑，同时满足定制化需求
 * @file: ChartToolBar.vue
 * @since: 2024-07-20 15:14:01
 **/
import {
  PushpinOutlined,
  PushpinFilled,
  ExpandOutlined,
  MoreOutlined,
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import { Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { t } from '@swanlab-vue/i18n'
import { useBoardStore } from '@swanlab-vue/board/store'

const props = defineProps({
  // 图表工具栏图标配置
  icons: {
    /** @type {PropType<ToolBarIconConfig[]>} */
    type: Array,
    default: () => []
  },
  chart: {
    /** @type {PropType<Chart>} */
    type: Object,
    required: true
  },
  // 是否显示放大按钮
  noZoom: {
    type: Boolean,
    default: false
  }
})
const boardStore = useBoardStore()
/**
 * @type {Ref<HTMLDivElement>}
 */
const toolbarRef = ref(null)
const emits = defineEmits(['zoom'])
const zoomChartEvent = inject('zoomChartEvent')
/** @type {SectionType} */
const sType = inject('SectionType')
/** @type {import('@swanlab-vue/board/ChartsBoard.vue').moveChartEvent} */
const changeChartPinOrHide = inject('ChangeChartPinOrHide')
const PinComponent = sType === 'PINNED' ? PushpinFilled : PushpinOutlined
const metricsData = inject('MetricsData')

const handleZoom = () => {
  boardStore.$zoom = { data: metricsData.value }
  zoomChartEvent()
}

/**
 * 工具栏图标配置属性
 * @typedef {Object} ToolBarIconConfig
 * @property {import('vue').Component} icon - 图标组件
 * @property {string} tip - 图标提示
 * @property {Function} handler - 图标点击事件
 * @property {Boolean} [show] - 当鼠标没有hover在工具栏上时隐藏，为true则始终显示
 * @property {Object} [style] - 图标特殊样式
 * @property {Boolean} [disabled] - 是否禁用
 * @property {Ref<Boolean>} [loading] - 是否替换为加载中
 */

/** @type {Role} */
const role = inject('Role')
const disabled = role === 'VIEWER' || role === 'VISITOR'
const pinLoading = ref(false)
/**
 * @type {ToolBarIconConfig[]} 工具栏图标配置
 */
const toolBarIcons = [
  // 置顶，取消置顶
  {
    icon: PinComponent,
    tip: sType === 'PINNED' ? t('chart.chart.toolbar.tips.unPin') : t('chart.chart.toolbar.tips.pin'),
    handler: () => {
      pinLoading.value = true
      changeChartPinOrHide(props.chart.index, sType === 'PINNED' ? 'PUBLIC' : 'PINNED')
    },
    show: sType === 'PINNED',
    disabled,
    loading: pinLoading,
    style: { color: sType === 'PINNED' ? 'var(--positive-default)' : '' }
  },
  // 放大
  {
    icon: ExpandOutlined,
    tip: t('chart.chart.toolbar.tips.zoom'),
    handler: handleZoom,
    disabled: props.noZoom || disabled
  },
  ...props.icons
]

// ---------------------------------- 控制菜单的显示和隐藏，所有菜单都需要手动关闭 ----------------------------------

const open = ref(false)

/**
 * @type {import("ant-design-vue/es/menu/src/interface").MenuClickEventHandler}
 */
const handleMenuClick = (e) => {
  // 如果key以close开头，则关闭菜单，否则一直开启
  if (String(e.key).startsWith('close')) {
    open.value = false
  }
}

// ---------------------------------- 图表隐藏事件 ----------------------------------
const hiddenLoading = ref(false)
const handleHidden = () => {
  hiddenLoading.value = true
  changeChartPinOrHide(props.chart.index, sType === 'HIDDEN' ? 'PUBLIC' : 'HIDDEN')
}

// ---------------------------------- toolbar显示和隐藏 ----------------------------------
const showToolbar = inject('ShowToolbar')
</script>

<style lang="scss" scoped>
.chart-toolbar {
  @apply absolute w-full h-6 top-0 left-0 pt-1 pr-2 z-full;
  .panel {
    @apply flex justify-end w-full items-center gap-2 text-dimmer;
  }
  .toolbar-button {
    @apply flex items-center justify-center rounded w-5 h-5;
    @apply hover:text-positive-default hover:bg-positive-dimmest;
    &:disabled {
      @apply cursor-not-allowed text-dimmest;
      span {
        cursor: not-allowed !important;
      }
      &:hover {
        @apply text-dimmest bg-transparent;
      }
    }
    svg {
      height: 10px !important;
    }
  }
}
</style>

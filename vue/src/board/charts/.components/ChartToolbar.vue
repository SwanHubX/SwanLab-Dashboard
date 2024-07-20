<template>
  <div class="chart-toolbar">
    <div class="panel">
      <button
        class="toolbar-button"
        v-for="(icon, index) in toolBarIcons"
        :class="{ 'hidden-no-hover': icon.hidden }"
        v-tippy="{ content: icon.tip }"
      >
        <component
          class="text-sm flex items-center"
          :key="index"
          :is="icon.icon"
          @click="icon.handler"
          :style="icon.style"
        />
      </button>
      <!-- 更多 -->
      <div v-tippy="{ content: $t('chart.toolbar.tips.more') }">
        <Dropdown class="toolbar-button hidden-no-hover" :trigger="['click']">
          <more-outlined style="transform: rotate(90deg)" />
          <template #overlay>
            <Menu style="width: 120px">
              <MenuItem>
                {{ $t('chart.toolbar.tips.hide') }}
              </MenuItem>
              <template name="more"></template>
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
 * @file: ChartToolbar.vue
 * @since: 2024-07-20 15:14:01
 **/
import { PushpinOutlined, PushpinFilled, ExpandOutlined, MoreOutlined } from '@ant-design/icons-vue'
import { Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { t } from '@swanlab-vue/i18n'

const props = defineProps({
  // 图表工具栏图标配置
  icons: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['zoom'])
/** @type {SectionType} */
const sType = inject('SectionType')
const PinComponent = sType === 'PINNED' ? PushpinFilled : PushpinOutlined

/**
 * 工具栏图标配置属性
 * @typedef {Object} ToolBarIconConfig
 * @property {Component} icon - 图标组件
 * @property {string} tip - 图标提示
 * @property {Function} handler - 图标点击事件
 * @property {Boolean} [hidden] - 始终隐藏
 * @property {Object} [style] - 图标新增样式
 */

/**
 * @type {ToolBarIconConfig[]} 工具栏图标配置
 */
const toolBarIcons = [
  {
    icon: PinComponent,
    tip: t('chart.toolbar.tips.pin'),
    handler: () => {
      console.log('固定')
    },
    hidden: sType !== 'PINNED'
  },
  {
    icon: ExpandOutlined,
    tip: t('chart.toolbar.tips.zoom'),
    handler: () => {
      emits('zoom')
    },
    hidden: true
  }
]
</script>

<style lang="scss" scoped>
.chart-toolbar {
  @apply absolute w-full h-full top-0 left-0 pt-1 pr-2 z-full;
  &:hover {
    .hidden-no-hover {
      @apply flex;
    }
  }
  .panel {
    @apply flex justify-end w-full items-center gap-2 text-dimmer;
  }
  .toolbar-button {
    @apply flex items-center justify-center rounded w-5 h-5;
    @apply hover:text-positive-higher hover:bg-positive-dimmest;
  }
  .hidden-no-hover {
    display: none;
  }
}
</style>

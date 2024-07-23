<template>
  <!-- 最外层接受父组件class，设置为absolute，当hover的时候设置z-index在最前 -->
  <div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" :style="{ zIndex }">
    <div class="w-full h-full bg-white-default border rounded relative">
      <ChartWrapper :chart="chart" />
      <a-modal v-model:open="open" width="100%" wrap-class-name="chart-zoom-modal">
        <div class="w-full h-full" :key="modalKey">
          <ChartWrapper :chart="chart" zoom v-if="mode == 'zoom'" />
          <component :is="editComponent" :chart="chart" v-else />
        </div>
        <template #footer>
          <div class="flex h-full w-full items-center justify-between">
            <!-- 放大模式 -->
            <template v-if="mode === 'zoom'">
              <div v-tippy="{ content: $t('chart.zoom.tips.edit') }">
                <Button size="large" disabled>{{ $t('chart.zoom.edit') }}</Button>
              </div>
              <Button size="large" class="font-semibold" @click="handleHidden">{{ $t('chart.zoom.close') }}</Button>
            </template>
            <!-- 编辑模式 -->
            <template v-else> </template>
          </div>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 图表拼图容器，关注拖拽逻辑和放大等逻辑，而不关心具体图表是什么以及里面的状态
 * @file: ChartPuzzle.vue
 * @since: 2024-07-14 20:57:49
 **/
import ChartWrapper from './chart/ChartWrapper.vue'
import { Button } from 'ant-design-vue'
defineProps({
  /** 图表配置 */
  chart: {
    /** @type {PropType<Chart>} */
    type: Object,
    required: true
  },
  /** 是否可拖拽 */
  draggable: {
    type: Boolean,
    default: false
  }
})

// ---------------------------------- 模态框选择 ----------------------------------
/**
 * 放大模式还是编辑模式，放大模式下重新渲染一个ChartWrapper组件
 * 编辑模式下需要使用事件传递来来的组件完成渲染
 * @type {Ref<'zoom' | 'edit'>}
 */
const mode = ref('zoom')
/** 控制模态框的显示 */
const open = ref(false)
/** @type {Ref<Number>} 模态框key，控制内部组件强制刷新 */
const modalKey = ref(0)
/** @type {Ref<Component>} 编辑模式下通过事件传递来的的组件 */
const editComponent = shallowRef(null)

// ---------------------------------- 关闭/开启模态框 ----------------------------------

provide('zoomChartEvent', () => {
  open.value = true
  mode.value = 'zoom'
  modalKey.value += 1
})
const handleHidden = () => {
  open.value = false
}

// ---------------------------------- absolute配置，当hover的时候设置z-index ----------------------------------
const hovering = ref(false)
// 999为toolbar的sticky z-index，不可设置大于等于1000，因为ant-design-vue的modal的z-index是1000
const zIndex = computed(() => (hovering.value ? 998 : undefined))
const handleMouseEnter = () => {
  hovering.value = true
}
const handleMouseLeave = () => {
  hovering.value = false
}

provide('ShowToolbar', hovering)
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.chart-zoom-modal {
  @apply flex justify-center items-center;
  .ant-modal {
    max-width: 80%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    height: calc(80vh);
    padding: 0;
  }
  .ant-modal-body {
    width: 100%;
    height: 90%;
  }
  .ant-modal-footer {
    height: 10%;
    margin-top: 0;
    @apply py-4 px-6  bg-higher border-t  rounded-b-lg;
  }
  .ant-modal-close {
    display: none;
    width: 50px;
    height: 50px;
    .ant-modal-close-x {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

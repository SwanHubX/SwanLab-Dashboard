<template>
  <!-- 最外层接受父组件class，设置为absolute，当hover的时候设置z-index在最前 -->
  <ZIndexFull>
    <div class="w-full h-full bg-white-default border rounded relative">
      <ChartWrapper class="chart-wrapper" :chart="chart" />
      <a-modal
        v-model:open="open"
        width="100%"
        :wrap-class-name="modalWrapperClass || 'chart-zoom-modal'"
        :footer="null"
      >
        <template #closeIcon></template>
        <div class="w-full h-full" :key="modalKey">
          <!-- 放大 -->
          <div class="zoom-modal" v-if="mode == 'zoom'">
            <div class="zoom-modal-body">
              <ZoomWrapper class="chart-wrapper" :chart="chart" />
            </div>
            <div class="zoom-modal-footer">
              <div v-tippy="{ content: $t('chart.zoom.tips.edit') }">
                <Button size="large" disabled>{{ $t('chart.zoom.edit') }}</Button>
              </div>
              <Button size="large" class="font-semibold" @click="handleHidden">{{ $t('chart.zoom.close') }}</Button>
            </div>
          </div>
          <!-- 编辑或下载 -->
          <component :is="modalComponent" :chart="chart" v-else />
        </div>
      </a-modal>
    </div>
  </ZIndexFull>
</template>

<script>
/**
 * 模态框模式
 * @typedef {'zoom' | 'edit' | 'download' | null} ModalMode
 */

/**
 * @callback OpenModalEvent
 * @param {ModalMode} m 模态框模式
 * @param {Component} [c] 下载或者编辑模式下传递来动态渲染的组件
 * @param {String} [cl] 模态框的类名，用于控制大小，注意必须是全局类名
 */
</script>

<script setup>
/**
 * @description: 图表拼图容器，关注拖拽逻辑和放大等逻辑，而不关心具体图表是什么以及里面的状态
 * @file: ChartPuzzle.vue
 * @since: 2024-07-14 20:57:49
 **/
import ChartWrapper from './chart/ChartWrapper.vue'
import ZIndexFull from './chart/ZIndexFull.vue'
import ZoomWrapper from './chart/ZoomWrapper.vue'
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
 * @type {Ref<'zoom' | 'edit' | 'download' | null>}
 */
const mode = ref('zoom')
/** 控制模态框的显示 */
const open = ref(false)
/** @type {Ref<Number>} 模态框key，控制内部组件强制刷新 */
const modalKey = ref(0)
/** @type {Ref<Component>} 编辑模式下通过事件传递来的的组件 */
const modalComponent = shallowRef(null)
const modalWrapperClass = ref(null)

// ---------------------------------- 关闭/开启模态框事件 ----------------------------------

provide(
  'openModalEvent',
  /** @type {OpenModalEvent} */ (m, c, cl) => {
    open.value = true
    mode.value = m
    modalKey.value += 1
    modalWrapperClass.value = cl
    modalComponent.value = null
  }
)
const handleHidden = () => {
  open.value = false
  mode.value = null
  modalComponent.value = null
  modalWrapperClass.value = null
}
</script>

<style lang="scss" scoped>
.zoom-modal {
  @apply w-full h-full;
  .zoom-modal-body {
    height: 90%;
  }
  .zoom-modal-footer {
    height: 10%;
    @apply py-4 px-6  bg-higher border-t  rounded-b-lg;
    @apply flex items-center justify-between;
  }
}
</style>
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
    height: 100%;
  }
  .ant-modal-footer {
    height: 10%;
    margin-top: 0;
    @apply py-4 px-6  bg-higher border-t  rounded-b-lg;
  }
}

.chart-wrapper {
  @apply h-full w-full relative top-0 left-0 rounded py-4 px-3;
}
</style>

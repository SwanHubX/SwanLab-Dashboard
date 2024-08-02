<template>
  <!-- 最外层接受父组件class，设置为absolute，当hover的时候设置z-index在最前 -->
  <ZIndexFull>
    <div class="w-full h-full bg-white-default border rounded relative">
      <ChartWrapper />
      <a-modal
        v-model:open="open"
        width="100%"
        :z-index="1500"
        centered
        :wrap-class-name="modalWrapperClass"
        :footer="null"
      >
        <template #closeIcon></template>
        <div class="w-full h-full">
          <component :is="chartComponents[mode]" :key="key" v-if="mode" />
        </div>
      </a-modal>
    </div>
  </ZIndexFull>
</template>

<script setup>
/**
 * @description: 图表拼图容器，关注拖拽逻辑和放大等逻辑，而不关心具体图表是什么以及里面的状态
 * @file: ChartPuzzle.vue
 * @since: 2024-07-14 20:57:49
 **/
import ChartWrapper from '../chart/ChartWrapper.vue'
import ZIndexFull from './layout/ZIndexFull.vue'
import { useBoardStore } from '../store'
import charts from '../charts'
const props = defineProps({
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
const boardStore = useBoardStore()
provide(
  'Chart',
  computed(() => props.chart)
)
// ---------------------------------- 模态框选择 ----------------------------------
/** 当前图表组件集 */
const chartComponents = charts[props.chart.type.toLocaleLowerCase()]
const mode = computed(() => boardStore.$modal?.mode)
const modalWrapperClass = computed(() => boardStore.$modal?.cl)
/** 控制模态框的显示 */
const open = ref(false)
/**
 * 为了防止抖动，当模态框关闭时不应该立即清空modal状态，而是等待模态框再次开启时清空
 * 因此需要增加一个key，用于开启时强制刷新组件
 */
const key = ref(0)
// 监听模态框关闭
boardStore.$onAction(({ name }) => {
  if (name === 'closeModal') {
    open.value = false
  }
})

// 设置 $modal 时模态框开启
watch(
  () => boardStore.$modal,
  () => {
    if (boardStore.$modal && boardStore.$modal.chart.index === props.chart.index) {
      open.value = true
      key.value++
    }
  }
)
</script>

<style lang="scss" scoped></style>

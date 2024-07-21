<template>
  <!-- 图表容器 -->
  <div class="chart-page">
    <ChartsBoard
      :sections="sections"
      :charts="charts"
      :MediaConstructor="C.getMediaMetrics"
      :ScalarConstructor="C.getScalarMetrics"
      :ResourceConstructor="C.getMediaResource"
      :MoveChartConstructor="MoveChartConstructor"
      :interval="interval"
      v-if="charts?.length"
    />
  </div>
</template>

<script setup>
/**
 * @description: 实验图表页，在本处将完成图表布局的初始化，注入订阅依赖等内容
 * @file: ChartPage.vue
 * @since: 2023-12-25 15:34:51
 **/
import { useExperimentStore } from '@swanlab-vue/store'
import http from '@swanlab-vue/api/http'
import { ref } from 'vue'
import ChartsBoard from '@swanlab-vue/board/ChartsBoard.vue'
import * as C from '@swanlab-vue/utils/chart'
const experimentStore = useExperimentStore()

/** 用于规定轮询器状态，0为不轮询（关闭轮询） */
const interval = ref(0)

/** @type {Ref<'loading' | 'success'>} */
const status = ref('loading')
/** 暂时先这么放着,后面可能放到 store 里 */
const sections = ref()
const charts = ref()
;(async function () {
  const { data } = await http.get(`/experiment/${experimentStore.id}/chart`)
  const res = C.formatLocalData(data)
  sections.value = res[0]
  charts.value = res[1]
  status.value = 'success'
})()

// ---------------------------------- 图表移动 ----------------------------------
/** @type {import('@swanlab-vue/board/ChartsBoard.vue').MoveChartConstructor} */
const MoveChartConstructor = async (cIndex, type) => {
  const data = await C.moveChartEventRequest(cIndex, type)
  const _ = C.formatLocalData(data)
  return {
    sections: _[0],
    charts: _[1]
  }
}
</script>

<style lang="scss" scoped>
.chart-page {
  @apply bg-higher min-h-[calc(100vh-163px)];
}
</style>

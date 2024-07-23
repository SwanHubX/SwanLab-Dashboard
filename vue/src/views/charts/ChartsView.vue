<template>
  <div class="flex flex-col min-h-full bg-higher">
    <template v-if="ready">
      <ChartsBoard
        v-model:refresh="refresh"
        v-model:sections="sections"
        v-model:charts="charts"
        :MediaConstructor="getMediaMetrics"
        :ScalarConstructor="getScalarMetrics"
        :ResourceConstructor="C.getMediaResource"
        :MoveChartConstructor="MoveChartConstructor"
        :MetricURIConstructor="MetricURIConstructor"
        :interval="interval"
        v-if="charts.length"
        multi
      />
      <!-- 图表不存在 -->
      <p class="font-semibold pt-5 text-center" v-else>Empty Charts</p>
    </template>
  </div>
</template>

<script setup>
/**
 * @description: 项目对比图表，本组件完成项目对比图表的数据的请求和展示，大致流程是：
 * 1. 通过 http.get('/project/charts') 请求项目对比图表的数据，渲染到页面上
 * 2. 根据每个图表的数据源
 * @file: ChartsView.vue
 * @since: 2024-01-27 13:05:27
 **/
import http from '@swanlab-vue/api/http'
import { ref } from 'vue'
import ChartsBoard from '@swanlab-vue/board/ChartsBoard.vue'
import * as C from '@swanlab-vue/utils/chart'
import { useProjectStore } from '@swanlab-vue/store'
const projectStore = useProjectStore()

/**
 * @type {Ref<Section[]>} sections section配置
 */
const sections = shallowRef()
/**
 * @type {Ref<Chart[]>} charts 图表配置
 */
const charts = computed(() => {
  // 根据不显示的实验id过滤图表
  /**
   * @type {Chart[]} cs
   */
  const cs = []
  _charts.value.forEach((chart) => {
    const c = { ...chart, metrics: [...chart.metrics] }
    // 过滤不显示的实验
    c.metrics = c.metrics.filter((metric) => !expIds.value.includes(metric.expId))
    if (c.metrics.length && c.metrics.some((m) => m.column.class !== 'SYSTEM')) {
      cs.push(c)
    }
  })
  // console.log(cs)
  return cs
})

/**
 * @type {Ref<Chart[]>} charts 全部的图表配置
 */
const _charts = shallowRef([])

/**
 * @type {Ref<IndexId[]>} expIds 当前不显示的实验id
 */
const expIds = computed(() => {
  return projectStore.experiments.map((exp) => (exp.show ? undefined : exp.id.toString())).filter((id) => id)
})

/** @type {Ref<boolean>} */
const refresh = ref(false)

/** 用于规定轮询器状态，0为不轮询（关闭轮询） */
const interval = ref(0)

const getMediaMetrics = C.createGetMediaMetrics(true)
const getScalarMetrics = C.createGetScalarMetrics(true)
// ---------------------------------- 请求图表数据 ----------------------------------
const ready = ref(false)
http.get('/project/charts').then(({ data }) => {
  const r = C.formatLocalData(data, projectStore.experiments)
  sections.value = r[0]
  _charts.value = r[1]
  ready.value = true
})

// ---------------------------------- 图表移动 ----------------------------------
/** @type {import('@swanlab-vue/board/ChartsBoard.vue').MoveChartConstructor} */
const MoveChartConstructor = async (cIndex, type) => {
  const data = await C.moveChartEventRequest(cIndex, type)
  const _ = C.formatLocalData(data, projectStore.experiments)
  return {
    sections: _[0],
    charts: _[1]
  }
}

// ---------------------------------- metric路径跳转 ----------------------------------
/** @type {import('@swanlab-vue/board/ChartsBoard.vue').MetricURIConstructor} */
const MetricURIConstructor = (index, expId) => {
  return `/experiment/${expId}/chart`
}
</script>

<style lang="scss" scoped></style>

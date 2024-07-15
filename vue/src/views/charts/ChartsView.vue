<template>
  <div class="flex flex-col min-h-full bg-higher">
    <template v-if="ready">
      <ChartsBoard :sections="sections" :charts="charts" v-if="charts.length" />
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
import { formatLocalData } from '@swanlab-vue/utils/chart'

/**
 * @type {Ref<Section[]>} sections section配置
 */
const sections = ref()
/**
 * @type {Ref<Chart[]>} charts 图表配置
 */
const charts = ref()
// ---------------------------------- 请求数据 ----------------------------------
const ready = ref(false)
http.get('/project/charts').then(({ data }) => {
  const r = formatLocalData(data)
  sections.value = r[0]
  charts.value = r[1]
  ready.value = true
})
</script>

<style lang="scss" scoped></style>
ku

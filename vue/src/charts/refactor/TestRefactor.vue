<template>
  <SectionLayout></SectionLayout>
</template>

<script setup>
/**
 * @description: 测试对布局的重构
 * @file: TestRefactor.vue
 * @since: 2024-07-13 19:50:03
 **/
import SectionLayout from './SectionLayout.vue'
import { useRoute } from 'vue-router'
import { useChartStore } from '@swanlab-vue/store'
import { mockLocalDataWithMultiExp, mockLocalDataWithSingleExp } from './mockdata'
import { formatLocalData } from '@swanlab-vue/utils/chart'

const route = useRoute()
const chartStore = useChartStore()

onMounted(() => {
  let data
  if (route.name === 'charts') data = mockLocalDataWithMultiExp()
  else data = mockLocalDataWithSingleExp()
  console.log(data)
  chartStore.init(data, () => {}, true)
})
</script>

<style lang="scss" scoped></style>

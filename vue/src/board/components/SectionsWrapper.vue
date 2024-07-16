<template>
  <SectionPuzzle
    v-for="section in props.sections"
    :key="section.index"
    :section="section"
    :charts="filterChartsBySection(section)"
    :mobile="mobile"
  />
</template>

<script setup>
/**
 * @description: Section包装器
 * @file: SectionsWrapper.vue
 * @since: 2024-07-16 00:58:17
 **/
import SectionPuzzle from '../puzzle/SectionPuzzle.vue'
import { debounce } from '../utils'
/**
 * @type {{sections: Section[], charts: Chart[]}} Props
 */
// @ts-ignore
const props = defineProps(['sections', 'charts'])

const emits = defineEmits(['fold-change'])

/**
 * 根据section过滤图表，获取到这个section包含的所有图表
 * @param {Section} section section配置
 */
const filterChartsBySection = (section) => {
  return props.charts.filter((chart) => section.chartIndex.includes(chart.index))
}

// ---------------------------------- 折叠、展开逻辑 ----------------------------------

// 初始化时获取所有已经打开的section index
const activeSectionIndex = ref(props.sections.filter((section) => !section.folded).map((section) => section.index))
/**
 * 当section展开/折叠时触发此事件
 * @param { IndexId[] } activeKey 所有展开的section index
 */
const handleSectionCollapseChange = (activeKey) => {
  console.log('section change', activeKey)
}

// ---------------------------------- 移动端局切换 ----------------------------------
/** 切换阈值，视口小于此值时切换 */
const threshold = 768
const mobile = ref(window.innerWidth < threshold)
const handleResize = () => {
  mobile.value = window.innerWidth < threshold
}
/** @type {() => void} */
// @ts-ignore
const debounceHandleResize = debounce(handleResize, 200)

onMounted(() => {
  window.addEventListener('resize', debounceHandleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', debounceHandleResize)
})

// ---------------------------------- 拖拽事件委托 ----------------------------------

// TODO 拖拽事件委托
</script>

<style lang="scss" scoped></style>

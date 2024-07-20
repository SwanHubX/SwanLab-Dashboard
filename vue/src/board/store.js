import { defineStore } from 'pinia'
import { ref } from 'vue'
/**
 * 当前鼠标悬浮的图表信息
 * @typedef {Object} ChartHovering
 * @property {SectionId} sIndex 所属section索引
 * @property {ChartId} cIndex 所属chart索引
 * @property {ExpId} eIndex 悬浮鼠标离哪个实验的指标最近
 * @property {{x: number, y: number}} position 鼠标位置
 */

export const useBoardStore = defineStore('board', () => {
  // ---------------------------------- state ----------------------------------

  const hovering = ref({})

  // ---------------------------------- action ----------------------------------

  return {}
})

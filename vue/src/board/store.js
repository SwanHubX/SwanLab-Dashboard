import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 指标信息在状态管理中的存储结构
 * {实验Id: {列的key: 指标数据}}
 * @typedef {Object.<ColumnKey, Object.<ExpId, MetricData>>} MetricStore
 */

export const useBoardStore = defineStore('board', () => {
  // ---------------------------------- state ----------------------------------

  /** @type {MetricStore} 指标存储数据 */
  const metrics = {}
  // ---------------------------------- action ----------------------------------
  const updateMetrics = () => {}

  return {
    metrics,
    updateMetrics
  }
})

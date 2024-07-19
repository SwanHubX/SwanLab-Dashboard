import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 指标信息在状态管理中的存储结构
 * {实验Id: {列的key: 指标数据}}
 * @typedef {Object.<ColumnKey, Object.<ExpId, MetricData>>} MetricStore
 */

export const useBoardStore = defineStore('board', () => {
  // ---------------------------------- state ----------------------------------

  /**
   * 轮询器状态，标识轮询器当前状态
   * idle: 空闲状态
   * busy: 轮询回调正在执行
   * waiting: 等待下一次轮询
   * canceled: 轮询已取消
   * @type {Ref<'idle' | 'busy' | 'waiting' | 'canceled'>}
   */
  const polling = ref('idle')
  /** @type {MetricStore} 指标存储数据 */
  const metrics = {}

  // ---------------------------------- action ----------------------------------
  const updateMetrics = () => {}

  return {
    metrics,
    polling,
    updateMetrics
  }
})

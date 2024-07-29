import { defineStore } from 'pinia'

export const useBoardStore = defineStore('board', () => {
  // ---------------------------------- 全局状态共享 ----------------------------------
  /** @type {import('vue').ShallowRef<LineSmoothInfo>} 折线图全局平滑 */
  const $smooth = shallowRef({ detail: null, value: 0 })
  /** @type {import('vue').ShallowRef<LineHoverInfo>} 折线图全局悬浮 */
  const $hover = shallowRef(null)
  /** @type {import('vue').ShallowRef<LineThickInfo>} 折线图全局粗细 */
  const $thick = shallowRef(null)
  /** @type {import('vue').ShallowRef<ZoomInfo>} 图表放大信息 */
  const $zoom = shallowRef(null)

  // ---------------------------------- action ----------------------------------

  return {
    $smooth,
    $hover,
    $thick,
    $zoom
  }
})

/**
 * 图表放大信息
 * @typedef {Object} ZoomInfo
 * @property {MetricData[]} data
 */

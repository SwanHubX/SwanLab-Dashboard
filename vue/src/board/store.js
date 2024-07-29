import { defineStore } from 'pinia'

export const useBoardStore = defineStore('board', () => {
  // ---------------------------------- 全局状态共享 ----------------------------------
  /** @type {import('vue').ShallowRef<LineSmoothInfo>} 折线图全局平滑 */
  const $smooth = shallowRef({ detail: null, value: 0 })
  /** @type {import('vue').ShallowRef<LineHoverInfo>} 折线图全局悬浮 */
  const $hover = shallowRef(null)
  /** @type {import('vue').ShallowRef<LineThickInfo>} 折线图全局粗细 */
  const $thick = shallowRef(null)
  /** @type {import('vue').ShallowRef<ChartPuzzleModalInfo>} 模态框信息 */
  const $modal = shallowRef(null)

  // ---------------------------------- action ----------------------------------
  return {
    $smooth,
    $hover,
    $thick,
    $modal
  }
})

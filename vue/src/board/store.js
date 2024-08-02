import { defineStore } from 'pinia'

export const useBoardStore = defineStore('board', () => {
  // ---------------------------------- 全局状态共享 ----------------------------------
  /** @type {import('vue').ShallowRef<LineSmoothInfo>} 当前折线图全局平滑 */
  const $smooth = shallowRef({ detail: null, value: 0 })
  /** @type {import('vue').ShallowRef<LineHoverInfo>} 当前折线图全局悬浮 */
  const $hover = shallowRef(null)
  /** @type {import('vue').ShallowRef<LineThickInfo>} 当前折线图全局粗细 */
  const $thick = shallowRef(null)
  /** @type {import('vue').ShallowRef<ChartPuzzleModalInfo>} 当前/上一次 模态框信息 */
  const $modal = shallowRef(null)

  // ---------------------------------- action ----------------------------------
  /**
   * 关闭模态框，[ChartPuzzle.vue](./puzzle/ChartPuzzle.vue) 将会监听此事件
   * 这用于在模态框内部关闭模态框——即使这个函数不做任何事情
   */
  const closeModal = () => {}
  return {
    $smooth,
    $hover,
    $thick,
    $modal,
    closeModal
  }
})

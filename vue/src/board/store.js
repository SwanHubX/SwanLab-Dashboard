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
 * 折线图悬浮信息
 * @typedef {Object} LineHoverInfo
 * @property {Number} x 悬浮坐标在折线图中的相对横坐标位置（基于折线图canvas左边）
 * @property {Number} y 悬浮坐标在折线图中的相对纵坐标位置（基于折线图canvas顶部）
 * @property {import('./charts/line/components/line').SeriesDetail} detail 当前悬浮信息距离哪个系列最近（非平滑系列）
 * @property {IndexId} cIndex 悬浮事件来源（来自哪个图表），用于防止栈溢出
 * @property {IndexId} sIndex 悬浮事件图表所属的序列
 * @property {Boolean} zoom 当前悬浮信息是否来自于zoom的图表，如果是则不触发粗细信息和悬浮信息的回调
 * @property {import('./charts/line/components/line').LineData[]} data 当前悬浮信息的数据，包含平滑系列数据
 */

/**
 * 折线图平滑信息
 * @typedef {Object} LineSmoothInfo
 * @property {import('./charts/line/components/smooth').SmoothDetail} detail 平滑具体参数
 * @property {Number} value 平滑值
 */

/**
 * 折线图粗细信息，所有的粗细信息都为被动触发，只需要设置此信息即可
 * @typedef {Object} LineThickInfo
 * @property {import('./charts/line/components/line').SeriesDetail} detail 当前加粗的系列
 * @property {Boolean} zoom 当前加粗信息是否来自于zoom的图表，如果是则只触发zoom的加粗回调
 */

/**
 * 图表放大信息
 * @typedef {Object} ZoomInfo
 * @property {MetricData[]} data
 */

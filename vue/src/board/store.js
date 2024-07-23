import { defineStore } from 'pinia'

export const useBoardStore = defineStore('board', () => {
  // ---------------------------------- state ----------------------------------
  /**
   * 全局状态共享
   * @type {GlobalState}
   */
  const $global = {
    smooth: shallowRef({ type: null, value: 0 })
  }

  // section内部状态共享通过provide/inject实现，不在此定义

  /** @type {LineState} 折线图共享状态*/
  const $line = {
    hover: shallowRef(null),
    thick: shallowRef(null)
  }

  // ---------------------------------- action ----------------------------------

  return {
    $global,
    $line
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
 * @property {SmoothType} type 平滑类型, null表示不平滑，'TWE'表示Time Weighted EMA，'RA'表示Running Average，'GS'表示Gaussian Smoothing
 * @property {Number} value 平滑值
 */

/**
 * 折线图粗细信息，所有的粗细信息都为被动触发，只需要设置此信息即可
 * @typedef {Object} ThickInfo
 * @property {import('./charts/line/components/line').SeriesDetail} detail 当前加粗的系列
 * @property {Boolean} zoom 当前加粗信息是否来自于zoom的图表，如果是则只触发zoom的加粗回调
 */

/**
 * 折线图状态
 * @typedef {Object} LineState
 * @property {import('vue').ShallowRef<LineHoverInfo | null>} hover 悬浮信息
 * @property {import('vue').ShallowRef<ThickInfo | null>} thick 粗细信息
 */

/**
 * 全局状态
 * @typedef {Object} GlobalState
 * @property {import('vue').ShallowRef<LineSmoothInfo>} smooth 平滑信息
 */

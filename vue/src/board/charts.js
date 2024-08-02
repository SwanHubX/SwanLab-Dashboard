import C from './.charts'
import T from './toolbar'
import Z from './zoom'
import D from './download'

/**
 * 图表组件集
 */
class ChartComponents {
  /**
   * @param {Component} chart 图表组件
   * @param {Component} [toolbar] 工具栏组件
   * @param {Component} [download] 下载组件
   * @param {Component} [zoom] 缩放组件
   */
  constructor(chart, toolbar = T.chart, download = null, zoom = Z.zoom) {
    this.chart = chart
    this.toolbar = toolbar
    this.zoom = zoom
    this.download = download
  }
}

/**
 * @typedef {Object} ChartsComponents
 * @property {ChartComponents} line 折线图
 * @property {ChartComponents} audio 音频图
 * @property {ChartComponents} image 图片图
 * @property {ChartComponents} text 文本图
 * @property {ChartComponents} error 错误图
 * @property {ChartComponents} empty 空图
 */

/**
 * @type {ChartsComponents} 图表组件
 */
export default {
  line: new ChartComponents(C.line, T.line, D.line),
  audio: new ChartComponents(C.audio),
  image: new ChartComponents(C.image),
  text: new ChartComponents(C.text),
  error: new ChartComponents(C.error),
  empty: new ChartComponents(C.empty, T.empty)
}

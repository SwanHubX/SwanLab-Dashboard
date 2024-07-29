import C from './.charts'
import T from './toolbar'

/**
 * @typedef {Object} ChartComponents
 * @property {Component} chart
 * @property {Component} toolbar
 */

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
  line: {
    chart: C.line,
    toolbar: T.line
  },
  audio: {
    chart: C.audio,
    toolbar: T.chart
  },
  image: {
    chart: C.image,
    toolbar: T.chart
  },
  text: {
    chart: C.text,
    toolbar: T.chart
  },
  error: {
    chart: C.error,
    toolbar: T.chart
  },
  empty: {
    chart: C.empty,
    toolbar: T.empty
  }
}

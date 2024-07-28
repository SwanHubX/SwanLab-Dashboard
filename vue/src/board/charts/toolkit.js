import { inject } from 'vue'
export * as U from '../utils'
/** 媒体信息获取器 */
export class MediaGetter {
  constructor() {
    /** @type {import("../ChartsBoard.vue").MediaMetricsConstructor} */
    this.getMediaMetrics = inject('MediaConstructor')
    /** @type {import("../ChartsBoard.vue").MediaResourceConstructor} */
    this.getMediaResource = inject('ResourceConstructor')
  }
  /**
   * 获取媒体资源请求函数
   * @type {import("../ChartsBoard.vue").MediaMetricsConstructor}
   * */
  metrics = this.getMediaMetrics

  /**
   * 获取媒体信息请求函数
   * @type {import("../ChartsBoard.vue").MediaResourceConstructor}
   * */
  resource = this.getMediaResource
}

/**
 * 输入columnId，返回颜色
 * @callback colorFinder
 * @param {ColumnId} columnId
 * @returns {String}
 */

/**
 * 使用颜色查找器
 * 输入当前chart，返回一个颜色生成函数
 * @param {Chart} chart 当前图表
 * @param {Boolean} multi 是否为多实验图表
 */
export const useColorFinder = (chart, multi) => {
  const isDark = inject('Dark')
  const index = isDark ? 1 : 0
  /** @type {colorFinder} */
  return (columnId) => {
    if (!multi) return chart.colors[index]
    for (const metric of chart.metrics) {
      if (metric.expId === columnId.experimentId && metric.column.key === columnId.key) {
        return metric.colors[index]
      }
    }
  }
}

/**
 * 输入到更新函数的指标渲染回调
 * @callback renderChart
 * @param {MetricData[]} newVal 新的指标数据
 * @param {MetricData[]} oldVal 旧的指标数据
 */

/**
 * 执行 {@link watchMetric} 后的返回值
 * @typedef {Object} watchMetricResult
 * @property {ComputedRef<Chart>} chart 当前图表配置
 * @property {Boolean} zoom 此图表是否处于缩放状态
 * @property {Boolean} multi 此图表是否为多实验图表
 */

/**
 * 监听指标变化，当指标变化时触发回调
 * 会立即触发一次，此时触发将在组件挂载的回调中执行，不用担心组件未挂载时的问题
 * @param {renderChart} render
 * @returns {watchMetricResult}
 */
export const watchMetric = (render) => {
  /** @type {import('vue').ShallowRef<MetricData[]>} */
  const data = inject('MetricsData')
  const multi = inject('Multi')
  const zoom = inject('Zoom', false)
  const chart = inject('Chart')
  onMounted(() => {
    watch(data, render, { immediate: true })
  })
  return { chart, zoom, multi }
}

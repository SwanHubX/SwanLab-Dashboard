import { inject } from 'vue'
/**
 * 科学记数法格式化数据，将普通数字转换为科学计数法，但是由于语言表示的限制，转换后的数据是字符串
 * 格式化规则如下：
 * 0. 定义区间：[min, max)，这两个值通过参数传入，默认为 [1e-7, 1e13)
 * 1. 区间内或者value为0，输入的值以非科学记数法表示
 * 2. 超出区间，统一使用科学计数法表示（不包括0）
 * 3. 科学计数法底数最多保留 digits 位小数
 * 4. 非科学计数法格式的数据，小数点后，保留到第一个有效数字及其后三位
 * 5. 在上述规则下，删除不必要的0，即删除小数点后，最后一个非零数后面的0
 *
 * @param {number| string} value 需要格式化的数字，可以是任何可以转换为数字的类型的值
 * @param {number} max 区间最大值，绝对值大于等于这个区间的值，统一使用科学计数法
 * @param {number} min 区间最小值，绝对值小于这个区间的值，统一使用科学计数法（不包括0）
 * @returns {string} 格式化后的数据
 */
export const formatNumber2SN = (value, max = 1e5, min = 1e-4, digits = 4) => {
  if (value === 'NaN' || value === 'INF') {
    return value
  }
  // 如果一个传入的数字的小数点后ignore_digits位全为0，那么把这个数当作整数来处理
  const ignore_digits = digits + 6
  // 将传入的数据转换为Number
  value = Number(value)
  // 检测符号
  const sign = value >= 0 ? '' : '-'
  // 取绝对值
  value = Math.abs(value)

  // 如果在区间内，使用普通计数法，只需要保留一定精度即可
  if ((value >= min && value < max) || value === 0) {
    /**
     * 这里使用 toFixed 的目的是，js 自动转化科学计数法的最小阈值是 e-6，而我们需要 e-7 才转化
     * 为了将 e-7 ~ e-6 之间的数从科学计数法转为十进制，需要转化一下
     * 要求保留小数点后第一个有效数字和其后三位，那么最多需要保留10位精度，例：0.000000123424
     */
    // 如果js自动转化为科学计数法
    if (value.toString().includes('e')) {
      // 获取最小的精度位
      const min_str = min.toString()
      const min_digits = Number(min_str.substring(min_str.indexOf('-') + 1))
      value = value.toFixed(min_digits + digits - 1)
    }

    // 到这里，可以保证 value 是一个十进制表示的，位于区间内的值，且为 string
    value = value.toString()

    // 找到小数点后第一位有效数字的索引
    const match = value.match(/\.\d*?([1-9])/)
    if (match) {
      // 如果找到匹配，获取 value 有效部分的长度
      // 小数点后第一个非零数在小数点后的索引（match[0]中包含了小数点 => 长度-1）
      const index = match[0].length - 1
      /**
       * 计算符合展示规则的长度
       * 如果非零值在小数点 ignore_digits 之后，小数部分当 0 算
       * 整数部分长度：value.substring(0, value.indexOf('.')).length
       * 小数部分长度：index + digits
       */
      const point_index = value.indexOf('.')
      if (index > ignore_digits) {
        value = value.substring(0, point_index)
      } else {
        const length = value.substring(0, point_index).length + index + digits
        value = value.substring(0, length)
      }
    }
    // 没有匹配上说明没有小数部分，直接略过

    /**
     * 默认删除小数点后，无意义的 0
     * 例如：1.01300 => 1.013
     */
    if (value.indexOf('.') !== -1) {
      value = value.replace(/(\.\d*?[1-9])?0+$/, '$1')
    }
  }
  // 如果超出范围，统一使用科学计数法
  else {
    value = value.toExponential(digits) // 注意 toExponential 的返回值是 string
    // 判断小数部分是否全为 0
    const point_index = value.indexOf('.')
    const e_index = value.indexOf('e')
    const fraction_part = value.substring(point_index + 1, e_index)
    if (/^0+$/.test(fraction_part)) {
      value = value.substring(0, point_index) + value.substring(e_index)
    } else {
      value = value.replace(/(\.\d*?[1-9])0+e/, '$1e')
    }
  }
  // 最后处理和返回的时候需要保证是字符串格式，不然，如果符合js自动转化的条件，会自动变成科学计数法
  return sign + value
}

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
 * 用于监听指标变化的函数
 * @callback MetricWatchFunc
 * @returns {MetricData[]}
 */

/**
 * 监听指标变化，当指标变化时触发回调
 * 会立即触发一次，此时触发将在组件挂载的回调中执行，不用担心组件未挂载时的问题
 * @param {MetricWatchFunc} getter
 * @param {renderChart} render
 */
export const watchMetric = (getter, render) => {
  onMounted(() => {
    watch(getter, render, { immediate: true })
  })
}

import { Line, G2 } from '@antv/g2plot'
import { formatNumber2SN } from '../../toolkit'

// 注册样式，最后一个点放大
G2.registerShape('point', 'last-point', {
  draw(cfg, container) {
    const point = { x: cfg.x, y: cfg.y }
    /** @type {ScalarDetail} */
    // @ts-ignore
    const data = cfg.data
    const shape = container.addShape('circle', {
      name: 'point',
      attrs: {
        // @ts-ignore
        x: point.x,
        // @ts-ignore
        y: point.y,
        fill: cfg.color || 'red',
        opacity: data._last ? 1 : 0,
        r: 3
      }
    })
    return shape
  }
})

/**
 * 数据系列类型，继承自String，多一个config属性
 */
class Series extends String {
  /**
   * @param {IndexId} experimentId 实验id
   * @param {String} key 数据的key
   * @param {String} color 颜色
   * @param {Boolean} [smooth=false] 是否平滑
   */
  constructor(experimentId, key, color, smooth = false) {
    const string = `${smooth}-${experimentId}-${key}`
    super(string)
    /**
     * @typedef {Object} SeriesConfig
     * @property {IndexId} experimentId 实验id
     * @property {String} key 数据的key
     * @property {String} color 颜色
     * @property {Boolean} smooth 是否平滑
     */
    /** @type {SeriesConfig} */
    this.config = {
      experimentId,
      key,
      color,
      smooth
    }
  }
}

/**
 * @typedef {Object} LineData
 * @property {Number} data 数据
 * @property {Number} index 步数
 * @property {Series} series 数据系列
 */

/**
 * 将标量数据展平为一维数组
 * @param {ScalarData[]} scalars
 * @param {import('../../toolkit').colorFinder} colorFinder
 * @returns {LineData[]}
 */
export const fmtScalar2Line = (scalars, colorFinder) => {
  const lineData = []
  for (const scalar of scalars) {
    if (!scalar.metrics) continue
    const s = new Series(
      scalar.experimentId,
      scalar.key,
      colorFinder({
        experimentId: scalar.experimentId,
        key: scalar.key
      })
    )
    for (const metric of scalar.metrics) {
      lineData.push({
        data: metric.data,
        index: metric.index,
        series: s,
        _last: metric._last
      })
    }
  }
  return lineData
}

/**
 * 创建折线图
 * @param {HTMLElement} dom 需要挂载的图表容器
 * @param {LineData[]} lineData 标量数据
 */
export const createLine = (dom, lineData) => {
  const rootStyle = getComputedStyle(document.documentElement)
  const lineWidth = 1.5
  const thickerLineWidth = 3.5
  const borderColor = rootStyle.getPropertyValue('--outline-default')
  const gridColor = rootStyle.getPropertyValue('--outline-dimmest')
  const crosshairsColor = rootStyle.getPropertyValue('--primary-dimmest')
  const line = new Line(dom, {
    data: lineData,
    // 默认的x轴依据key为step
    xField: 'index',
    // 默认的y轴依据key为data
    yField: 'data',
    // 多数据的时候，需要设置seriesField，单数据也可以设置，但是不希望出现label
    seriesField: 'series',
    // 自己写图例
    legend: false,
    // 颜色通过回调拿到
    color: (/** @type {{series: Series}} */ { series }) => {
      return series.config.color
    },
    point: {
      shape: 'last-point'
    },
    lineStyle: {
      lineWidth
    },
    // 坐标轴相关
    xAxis: {
      // 自定义坐标轴的刻度，暂时没有找到文档，通过源码来看是返回一个数组，数组内是字符串，代表刻度
      tickCount: 5,
      type: 'linear',
      // 在此处完成X轴数据的格式化
      label: {
        // @ts-ignore
        formatter: (/** @type {Number} */ index) => {
          // 如果是小数，返回空
          if (index % 1 !== 0) return ''
          // 如果是100的倍数且大于1000，返回k
          if (index % 100 === 0 && index >= 1000) return `${index / 1000}k`
          return index
        }
      },

      // x轴坐标轴样式
      line: {
        style: {
          stroke: borderColor,
          lineWidth: 2
        }
      },
      // x轴刻度样式
      tickLine: {
        length: 4,
        style: {
          stroke: borderColor,
          lineWidth: 2
        }
      }
    },
    yAxis: {
      min: null,
      label: {
        // 在此处完成Y轴数据的格式化
        formatter: (data) => {
          return formatNumber2SN(data)
        }
      },
      // y轴坐标轴样式
      line: {
        style: {
          stroke: borderColor,
          lineWidth: 2
        }
      },
      // y轴刻度样式
      tickLine: {
        length: 4,
        style: {
          stroke: borderColor,
          lineWidth: 2
        }
      },
      // 网格线
      grid: {
        line: {
          style: {
            stroke: gridColor
          }
        }
      }
    },
    // 悬浮提示相关
    tooltip: {
      // 在此处完成悬浮数据提示的格式化
      // 如果需要自定义浮窗，可以用下面的customContent
      // formatter: (data) => {
      //   // console.log(data)
      //   // 如果data.series是undefined，说明是单数据,直接显示source[0]即可
      //   const name = data.series ? data.series : source[0]
      //   return { name, value: formatNumber2SN(data.data) }
      // },
      follow: true,
      enterable: false,
      shared: true,
      position: 'top',
      showMarkers: true,
      customContent: () => '',
      domStyles: {
        // 自己写tooltip的样式
        'g2-tooltip': {
          boxShadow: 'none',
          borderWidth: 'none',
          borderRadius: 'none'
        }
      },
      showCrosshairs: true,
      crosshairs: {
        line: {
          style: {
            stroke: crosshairsColor,
            lineWidth: 2
          }
        }
      }
    },
    // 大小相关
    autoFit: true,
    // 开启一些交互
    // interactions: [{ type: 'element-active' }],
    // 平滑曲线
    smooth: false,
    animation: false
  })

  line.render()

  return {
    line,
    /**
     * 加粗
     */
    thicker: () => {},
    /**
     * 变细
     */
    thinner: () => {}
  }
}

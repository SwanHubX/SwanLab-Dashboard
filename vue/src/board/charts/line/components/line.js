import { Line, G2 } from '@antv/g2plot'
import { formatNumber2SN } from '../../toolkit'
import { useBoardStore } from '@swanlab-vue/board/store'

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
 * 这个数据类型的详细信息
 * @typedef {Object} SeriesDetail
 * @property {IndexId} series 数据唯一识别字符串，也就是series
 * @property {String} name 前端显示的名称
 * @property {IndexId} experimentId 实验id
 * @property {String} key 数据的key
 * @property {String} color 颜色
 * @property {Boolean} smooth 是否平滑
 */

/**
 * @typedef {Object} LineData
 * @property {Number} data 数据
 * @property {Number} index 步数
 * @property {string} series 数据类型标识，这b图表不支持使用类型，只能用字符串 🤡
 * @property {SeriesDetail} detail 数据配置，包含这个series的更多信息
 * @property {Boolean} _last 是否是最后一个点
 */

/**
 * @typedef {Object} LineMaps
 * @property {Map} color key为series，value为color
 * @property {Map} experiment key为实验id，value为空列表（进一步计算element映射时使用）
 */

/**
 * @typedef {Object} fmtScalar2LineResult
 * @property {LineData[]} data 格式化后的标量数据
 * @property {LineMaps} maps 一些计算好的的映射关系
 */

/**
 * 将标量数据展平为一维数组，并且形成type-color映射关系
 * @param {ScalarData[]} scalars
 * @param {import('../../toolkit').colorFinder} colorFinder
 * @returns {fmtScalar2LineResult}
 */
export const fmtScalar2Line = (scalars, colorFinder) => {
  const lineData = []
  const colorMap = new Map()
  const experimentMap = new Map()
  for (const scalar of scalars) {
    if (!scalar.metrics) continue
    // series格式为：{smooth/common}-{experimentId}-{columnKey}
    // TODO 在此处判断平滑化
    const series = `${'common'}-${scalar.experimentId}-${scalar.key}`
    /** @type {SeriesDetail} */
    const detail = {
      name: scalar.name,
      series,
      experimentId: scalar.experimentId,
      key: scalar.key,
      color: colorFinder({
        experimentId: scalar.experimentId,
        key: scalar.key
      }),
      smooth: false
    }
    colorMap.set(series, detail.color)
    if (!experimentMap.has(scalar.experimentId)) experimentMap.set(scalar.experimentId, [])
    for (const metric of scalar.metrics) {
      lineData.push({
        data: metric.data,
        index: metric.index,
        series,
        detail,
        _last: metric._last
      })
    }
  }
  return {
    data: lineData,
    maps: {
      color: colorMap,
      experiment: experimentMap
    }
  }
}

/**
 * 当前hover数据发生更改的回调
 * @callback LineHoverDataUpdateCallback
 * @param {LineData[]} data
 */

/**
 * 创建折线图
 * @param {HTMLElement} dom 需要挂载的图表容器
 * @param {LineData[]} lineData 标量数据
 * @param {IndexId} cIndex 图表id
 * @param {LineMaps} maps 一些计算好的的映射关系
 * @param {Boolean} zoom 是否为缩放环境，如果是缩放环境的tooltip事件，不会被动触发
 * @param {LineHoverDataUpdateCallback} callback 当前hover数据发生更改的回调
 */
export const createLine = (dom, lineData, cIndex, maps, zoom, callback) => {
  /** @type {IndexId} 图表所属section的id */
  const sIndex = inject('SectionIndex')
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
    color: (/** @type {{series: string}} */ { series }) => {
      return maps.color.get(series)
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
  const boardStore = useBoardStore()
  /**
   * 写入到折线图中的单个数据包装
   * @typedef {Object} LineItems
   * @property {LineData} data 原始数据
   * @property {String} color 数据颜色
   * @property {String} name 数据名称
   * @property {String} title 目测为当前数据的步数（对应index）
   * @property {Number} value 数据值
   * @property {Number} x 数据坐标在折线图中的相对横坐标位置（基于折线图canvas左边）
   * @property {Number} y 数据坐标在折线图中的相对纵坐标位置（基于折线图canvas顶部）
   */
  /**
   * 折线图悬浮提示事件对象
   * @typedef {Object} LineToolTipEvent
   * @property {Object} data 事件主要信息
   * @property {Number} data.x 悬浮坐标在折线图中的相对横坐标位置（基于折线图canvas左边）
   * @property {Number} data.y 悬浮坐标在折线图中的相对纵坐标位置（基于折线图canvas顶部）
   * @property {String} data.title 目测为当前悬浮的数据的步数（对应index）
   * @property {LineItems[]} data.items 当前悬浮的数据
   */

  // 监听悬浮事件，当前图表主动触发此事件时，修改store中的hoverInfo
  line.on('tooltip:show', (/** @type {LineToolTipEvent} */ evt) => {
    callback && callback(evt.data.items.map((item) => item.data))
    // 说明当前悬浮的数据是来自于其他图表，此时为被动触发事件，不需要更新
    if (boardStore.$line.hoverInfo && boardStore.$line.hoverInfo.cIndex !== cIndex) {
      return
    }

    // 计算距离当前坐标最近的数据
    const nowY = evt.data.y
    let min = Infinity
    let detail = null
    for (const item of evt.data.items) {
      const y = item.y
      const diff = Math.abs(y - nowY)
      if (diff < min) {
        min = diff
        detail = item.data.detail
      }
    }
    // 更新store中的hoverInfo
    boardStore.$line.hoverInfo = {
      x: evt.data.x,
      y: evt.data.y,
      detail,
      cIndex,
      sIndex,
      data: evt.data.items.map((item) => item.data),
      zoom
    }
    // 更新store中的thickInfo
    boardStore.$line.thickInfo = {
      detail,
      zoom
    }
  })
  // 当前图表主动触发隐藏事件时，重置store中的hoverInfo
  line.on('tooltip:hide', () => {
    // 如果当前悬浮的数据是来自于其他图表，此时为被动触发事件，不需要更新
    if (boardStore.$line.hoverInfo && boardStore.$line.hoverInfo.cIndex !== cIndex) {
      return
    }
    boardStore.$line.hoverInfo = null
    boardStore.$line.thickInfo = null
  })

  // 监听hoverInfo变化，被动hide和被动show
  watch(
    () => boardStore.$line.hoverInfo,
    (newVal) => {
      // 如果新数据为null，代表hide
      if (!newVal) return line.chart.hideTooltip()
      // 如果是当前图表的悬浮事件，不需要更新
      if (newVal.cIndex === cIndex) return
      // 如果不是同一个section的悬浮事件，不需要更新
      if (newVal.sIndex !== sIndex) return
      // 如果是zoom的图表，不需要更新
      if (newVal.zoom) return
      line.chart.showTooltip({ x: newVal.x, y: newVal.y })
    }
  )
  // FIXME 如果以后同一图表中出现相同实验不同key的数据，需要进一步明确
  // 由于按照实验id加粗，所以需要根据实验id分组
  const nameSet = new Set()
  /**
   * @type {Map<IndexId, G2.Element[]>}
   */
  const elMap = maps.experiment
  for (const el of line.chart.getElements()) {
    const model = el.getModel()
    /** @type {SeriesDetail} */
    let detail = null
    // 需要注意的是每一个元素的data代表映射的样式数据，这可能是一个Object，也可能是一个Object[]
    if (Array.isArray(model.data)) {
      detail = model.data[0].detail
    } else {
      detail = model.data.detail
    }
    if (!nameSet.has(detail.name)) {
      nameSet.add(detail.name)
      elMap.get(detail.experimentId).push(el)
    }
    // 如果已经全部找到，就不再继续
    if (nameSet.keys.length === maps.color.size) break
  }
  // console.log('elMap', elMap)

  // 同一个实验的折线图，共享粗细信息
  let lastThickEls = [] // 上一个加粗的元素列表
  watch(
    () => boardStore.$line.thickInfo,
    (newVal) => {
      // 取消加粗
      for (const el of lastThickEls) el.update({ ...el.getModel(), style: { lineWidth } })
      lastThickEls = []
      // 需要加粗
      if (newVal) {
        // 只触发当前是zoom的图表
        if (newVal.zoom !== zoom) return
        // 需要注意的是每一个元素的data代表映射的样式数据，这可能是一个Object，也可能是一个Object[]
        const els = elMap.get(newVal.detail.experimentId)
        if (!els) return
        for (const el of els) el.update({ ...el.getModel(), style: { lineWidth: thickerLineWidth } })
        lastThickEls = els
      }
    }
  )
  return {
    plot: line
  }
}

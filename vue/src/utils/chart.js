import http from '@swanlab-vue/api/http'
/**
 * @typedef { Object } OriginalChartData 本地版图表初始化接口返回的原始数据类型
 * @property { OriginalNamespace[] } namespaces 命名空间
 * @property { OriginalChart[] } charts 图表
 */

/**
 * @typedef { Object } OriginalNamespace
 * @property { Number } id 命名空间ID，-1表示置顶，-2表示隐藏
 * @property { String } name 命名空间名称
 * @property { String } description 命名空间描述
 * @property { Number } sort 排序
 * @property { Object | null } more 更多信息
 * @property { Object | null } experiment_id 所属实验信息(多实验图表时为 null)
 * @property { Object | null } project_id 所属项目信息(单实验图表时为 null)
 * @property { Array<Number> } charts 图表ID数组
 * @property { Number } opened 0表示收起，1表示展开
 * @property { String } created_time 创建时间
 * @property { String } updated_time 更新时间
 */

/**
 * @typedef {Object} OriginalSource
 * @property {String} key 指标名称
 * @property {String} experiment_id 实验ID
 */

/**
 * @typedef { Object } OriginalChart
 * @property { Number } id 图表ID
 * @property { 'default' | 'line' | 'image' | 'audio' | 'text' } type 图表类型
 * @property { String } name 图表名称
 * @property { String } description 图表描述
 * @property { Boolean } multi 是否是多实验图表
 * @property { String } reference 实验进度参考
 * @property { Object | null } config 图表配置
 * @property { Object | null } more 更多信息
 * @property { Number | null } sort 排序
 * @property { Object | null } error 错误信息
 * @property { Number } status 图表状态
 * @property { Number } system 0 为系统自动生成的多试验图表，1 为某实验所属图表
 * @property { Array<OriginalSource> } source 图表数据来源列表
 * @property { Object | null } experiment_id 所属实验信息(多实验图表时为 null)
 * @property { Object | null } project_id 所属项目信息(单实验图表时为 null)
 * @property { String } created_time 创建时间
 * @property { String } updated_time 更新时间
 */

/**
 * 从后端获取到的原始指标数据格式
 * @typedef {Object} OriginalMetricData
 * @property {String} experiment_id 实验ID
 * @property {String} key 指标名称
 * @property {ScalarDetail[]} list 指标数据
 */

const generateXAxis = () => {
  return {
    class: 'SYSTEM',
    error: null,
    key: 'step',
    name: 'step',
    type: 'FLOAT'
  }
}

const generateYAxis = (key, name, type) => {
  return {
    class: 'CUSTOM',
    key,
    name,
    type,
    error: null
  }
}

/**
 * 针对本地版进行数据格式化
 * @param { OriginalChartData } data
 * @param {Array<{light:string, dark:string, id: Number}>} [exps] 实验信息，用于设置指标颜色
 * @returns { [ Section[], Chart[]] } 格式化后的数据
 */
export const formatLocalData = (data, exps) => {
  const { namespaces, charts } = data

  const tempSections = formatSections(namespaces)
  addMissingSections(tempSections)

  const tempCharts = formatCharts(charts, exps)

  return [tempSections, tempCharts]
}

/**
 * 格式化 Namespace 数据结构到 Section
 * @param {OriginalNamespace[]} namespaces
 * @returns {Section[]} sections
 */
const formatSections = (namespaces) => {
  return namespaces.map((ns) => {
    const typeMap = {
      '-1': 'PINNED',
      '-2': 'HIDDEN'
    }

    const mediaTypes = ['Image', 'Audio', 'Text', 'Media']
    const type = typeMap[ns.id] || 'PUBLIC'

    const section = {
      name: ns.name,
      chartIndex: ns.charts.map((v) => String(v)),
      folded: ns.opened === 0,
      config: ns.more,
      index: String(ns.id),
      type: type,
      rowHeight: mediaTypes.includes(ns.name) ? 300 : 272,
      /** @type {7 | 6 | 4 | 3 | 2 | 1} */
      cols: mediaTypes.includes(ns.name) ? 1 : 3
    }

    return section
  })
}

/**
 * 如果确实 HIDDEN 或 PINNED，则添加
 * @param {Section[]} sections
 */
const addMissingSections = (sections) => {
  const addSectionIfMissing = (type, name, index) => {
    if (!sections.some((section) => section.type === type)) {
      /** @type {Section} */
      const section = {
        name,
        chartIndex: [],
        folded: type === 'HIDDEN',
        index: String(index),
        config: null,
        type,
        rowHeight: 272,
        cols: 3
      }

      if (type === 'HIDDEN') sections.push(section)
      else sections.unshift(section)
    }
  }
  // 无命名空间则忽略
  if (sections.length !== 0) {
    addSectionIfMissing('PINNED', 'pinned', -1)
    addSectionIfMissing('HIDDEN', 'hidden', -2)
  }
}

/**
 * 格式化 OriginalChart 为 Chart
 * @param {OriginalChart[]} charts
 * @param {Array<{light:string, dark:string, id: Number}>} [exps] exps
 * @returns {Chart[]} charts
 */
const formatCharts = (charts, exps) => {
  return charts.map((chart) => {
    /** @type {'LINE' | 'TEXT' | 'IMAGE' | 'AUDIO'} */
    // @ts-ignore
    const type = chart.type.toUpperCase() === 'DEFAULT' ? 'LINE' : chart.type.toUpperCase()
    /** @type {Chart} */
    const tempChart = {
      index: String(chart.id),
      title: chart.name,
      config: chart.config,
      color: '#528d59',
      type: type,
      metrics: []
    }

    const yAxis = generateYAxis(tempChart.title, tempChart.title, type === 'LINE' ? 'FLOAT' : type)
    /** @type {Column} */
    // @ts-ignore
    const xAxis = generateXAxis()

    if (type === 'LINE') {
      tempChart.config = {
        xAxis,
        xTitle: 'Step',
        yAxis: [yAxis],
        yTitle: chart.name
      }
      tempChart.metrics.push({
        axis: 'X',
        column: xAxis,
        // @ts-ignore
        colors: [],
        name: 'summary'
      })
    }

    let source = chart.source
    if (source.length > 10) {
      tempChart.captured = 10
      source = source.slice(0, 10)
    }

    source.forEach((m) => {
      const colors = exps ? getExperimentColors(Number(m.experiment_id), exps) : []
      tempChart.metrics.push({
        axis: type === 'LINE' ? 'Y' : 'X',
        // @ts-ignore
        colors,
        expId: m.experiment_id,
        name: m.key,
        column: JSON.parse(JSON.stringify(yAxis))
      })
    })

    handleChartErrors(chart, tempChart)

    return tempChart
  })
}

/**
 * 获取实验颜色
 * @param {number} experimentId
 * @param {Array<{light:string, dark:string, id: Number}>} [exps] exps
 * @returns
 */
const getExperimentColors = (experimentId, exps) => {
  const exp = exps.find((v) => v.id === Number(experimentId))
  return exp ? [exp.light, exp.dark] : []
}
const handleChartErrors = (chart, tempChart) => {
  const error = chart.error
  if (!error || Object.keys(error).length === 0) return
  Object.keys(error).forEach((key) => {
    const target = tempChart.metrics.find((v) => v.name === key)
    if (target) {
      target.column.error = error[key]
    }
  })
}

/**
 * 针对本地版进行数据格式化
 * @param {OriginalMetricData[]} metricsData 指标数据集合
 * @returns {ScalarData[]} 格式化后的数据
 */
export const formatLocalScalarData = (metricsData) => {
  return metricsData.map((metric) => {
    return {
      experimentId: metric.experiment_id,
      key: metric.key,
      type: 'scalar',
      metrics: metric.list
    }
  })
}

// ---------------------------------- 请求媒体数据 ----------------------------------

/** @type {import('@swanlab-vue/board/ChartsBoard.vue').MediaMetricsConstructor} */
export const getMediaMetrics = async (metrics, step) => {
  console.log('getMediaMetrics', metrics, step)
  return []
}

/** @type {import('@swanlab-vue/board/ChartsBoard.vue').MediaResourceConstructor} */
export const getMediaResource = async (resource) => {
  console.log('getMediaResource', resource)
  return []
}
// ---------------------------------- 请求标量数据 ----------------------------------

/** @type {import('@swanlab-vue/board/ChartsBoard.vue').ScalarMetricsConstructor} */
export const getScalarMetrics = async (metrics) => {
  const res = await Promise.all(metrics.map((m) => http.get(`/experiment/${m.experimentId}/tag/${m.key}`)))
  return formatLocalScalarData(res.map((r) => r.data))
}

// ---------------------------------- 组件移动事件 ----------------------------------

/**
 * 组件移动
 * @param {ChartId} cIndex 图表ID
 * @param {'MOVE' | 'PINNED' | 'HIDDEN' | 'PUBLIC'} type 移动类型
 * @returns {Promise<{charts: OriginalChart[], namespaces: OriginalNamespace[]}>}
 */
export const moveChartEventRequest = async (cIndex, type) => {
  if (type === 'MOVE') throw new Error('MOVE is not supported yet')
  // HIDDEN对应-1，PINNED对应1，PUBLIC对应0
  const { data } = await http.patch(`/chart/${cIndex}/status`, {
    status: type === 'HIDDEN' ? -1 : type === 'PINNED' ? 1 : 0
  })
  return data
}

/**
 * 图表相关
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
 * @param { OriginalData } data
 * @returns { [ Section[], Chart[]] } 格式化后的数据
 */
export const formatLocalData = (data) => {
  const { namespaces, charts } = data
  const temp_sections = namespaces.map((ns) => {
    const temp = {
      type: ns.type,
      name: ns.name,
      chartIndex: ns.charts,
      pinned: false,
      folded: ns.opened === 0,
      config: ns.more,
      index: ns.id
    }
    if (ns.name === 'pinned' && ns.id === -1) {
      temp.type = 'PINNED'
      temp.pinned = true
    } else if (ns.name === 'hidden' && ns.id === -2) temp.type = 'HIDDEN'
    else temp.type = 'PUBLIC'
    return temp
  })

  const temp_charts = charts.map((chart) => {
    const temp = {
      index: chart.id,
      title: chart.name,
      size: chart.size || null,
      config: chart.config,
      type: chart.type.toUpperCase(),
      metrics: []
    }
    if (temp.type === 'DEFAULT') temp.type = 'LINE'
    const yAxis = generateYAxis(temp.title, temp.title, temp.type === 'LINE' ? 'FLOAT' : temp.type)
    const xAxis = generateXAxis()
    if (temp.type === 'LINE') {
      temp.config = {
        xAxis,
        xTitle: 'Step',
        yAxis: [yAxis],
        yTitle: chart.name
      }
      temp.metrics.push({
        axis: 'X',
        column: xAxis,
        colors: [],
        name: 'summary'
      })
    }
    chart.source.forEach((m) => {
      temp.metrics.push({
        axis: temp.type === 'LINE' ? 'Y' : 'X',
        colors: [],
        expId: chart.source_map[m],
        name: m,
        column: yAxis
      })
    })
    return temp
  })
  return [temp_sections, temp_charts]
}

/**
 * @typedef { Object } OriginalData
 * @property { Namespace[] } namespaces 命名空间
 * @property { OriginalChart[] } charts 图表
 */

/**
 * @typedef { Object } Namespace
 * @property { Number } id 命名空间ID，-1表示置顶，-2表示隐藏
 * @property { String } name 命名空间名称
 * @property { String } description 命名空间描述
 * @property { Number } sort 排序
 * @property { Object | null } more 更多信息
 * @property { Object | null } experiment_id 所属实验信息(多实验图表时为 null)
 * @property { Object | null } project_id 所属项目信息(单实验图表时为 null)
 * @property { Int[] } charts 图表ID数组
 * @property { Number } opened 0表示收起，1表示展开
 * @property { String } created_time 创建时间
 * @property { String } update_time 更新时间
 */

/**
 * @typedef { Object } OriginalChart
 * @property { Number } id 图表ID
 * @property { 'default' | 'line' | 'image' | 'audio' | 'text' } type 图表类型
 * @property { String } name 图表名称
 * @property { String } description 图表描述
 * @property { Boolean } multi 是否是多实验图表
 * @property { String } reference 实验进度参考
 * @property { String[] } source 图表数据来源列表，当前为实验名
 * @property { Object<String, Number> } source_map 图表数据来源映射，当前为实验ID
 * @property { Object | null } experiment_id 所属实验信息(多实验图表时为 null)
 * @property { Object | null } project_id 所属项目信息(单实验图表时为 null)
 * @property { String } created_time 创建时间
 * @property { String } update_time 更新时间
 */

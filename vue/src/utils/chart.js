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

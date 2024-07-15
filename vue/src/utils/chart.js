/**
 * @typedef { Object } OriginalChartData 本地版图表初始化接口返回的原始数据类型
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
 * @property { Array<Number> } charts 图表ID数组
 * @property { Number } opened 0表示收起，1表示展开
 * @property { String } created_time 创建时间
 * @property { String } updated_time 更新时间
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
 * @property { Array<String> } source 图表数据来源列表，当前为实验名
 * @property { Object<String, Number> } source_map 图表数据来源映射，当前为实验ID
 * @property { Object | null } experiment_id 所属实验信息(多实验图表时为 null)
 * @property { Object | null } project_id 所属项目信息(单实验图表时为 null)
 * @property { String } created_time 创建时间
 * @property { String } updated_time 更新时间
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
 * @returns { [ Section[], Chart[]] } 格式化后的数据
 */
export const formatLocalData = (data) => {
  const { namespaces, charts } = data
  // ---------------------------------- section 相关 ----------------------------------
  /** @type {Section[]} */
  const tempSections = namespaces.map((/** @type {Namespace} */ ns) => {
    const temp = {
      name: ns.name,
      chartIndex: ns.charts.map((v) => String(v)),
      folded: ns.opened === 0,
      config: ns.more,
      index: String(ns.id),
      type: null,
      rowHeight: 400,
      cols: /** @type {7 | 6 | 4 | 3 | 2 | 1} */ (3)
    }
    // 处理图表分类块的类别：[PUBLIC, PINNED, HIDDEN]
    if (ns.name === 'pinned' && ns.id === -1) temp.type = 'PINNED'
    else if (ns.name === 'hidden' && ns.id === -2) temp.type = 'HIDDEN'
    else temp.type = 'PUBLIC'
    // 媒体类型的空间默认 1 列,高度300
    if (['Image', 'Audio', 'Text', 'Media'].includes(temp.name)) {
      temp.cols = 1
      temp.rowHeight = 300
    }
    return temp
  })
  // ---------------------------------- chart 相关 ----------------------------------
  /** @type {Chart[]} */
  const tempCharts = charts.map((chart) => {
    const type = chart.type.toUpperCase()
    const temp = {
      index: String(chart.id),
      title: chart.name,
      config: chart.config,
      color: /** @type {'#528d59'} */ ('#528d59'),
      type: /** @type {'LINE' | 'TEXT' | 'IMAGE' | 'AUDIO'} */ (type === 'DEFAULT' ? 'LINE' : type),
      metrics: []
    }
    // ---------------------------------- metric 相关 ----------------------------------
    const yAxis = generateYAxis(temp.title, temp.title, temp.type === 'LINE' ? 'FLOAT' : temp.type)
    const xAxis = generateXAxis()
    // 这线图需要添加配置信息，且metric中添加系统生成的X轴
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
        expId: String(chart.source_map[m]),
        name: m,
        column: JSON.parse(JSON.stringify(yAxis)) // 深拷贝，防止在下一步错误处理中添加错误时让所有 metric 都报错
      })
    })
    // ---------------------------------- 错误相关 ----------------------------------
    const error = chart.error
    if (!error || Object.keys(error).length === 0) return temp
    // 遍历error,找到对应的metric，设置error
    Object.keys(error).forEach((key) => {
      const target = temp.metrics.find((v) => v.name === key)
      target.column.error = error[key]
    })
    return temp
  })
  return [tempSections, tempCharts]
}

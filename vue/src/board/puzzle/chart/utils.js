/**
 * 解析chart中包含的指标信息，只获取其中列为'CUSTOM'的指标
 * @param {Chart} chart 图表配置
 * @returns {{infos:Metric[], ids:MetricId[]}} 指标Id列表
 */
export const parseChartMetrics = (chart) => {
  /** @type {Metric[]} */
  const infos = []
  /** @type {MetricId[]} */
  const ids = []
  for (const metric of chart.metrics) {
    if (metric.column.class === 'CUSTOM') {
      infos.push(metric)
      ids.push({ key: metric.column.key, experimentId: metric.expId })
    }
  }
  return { infos, ids }
}

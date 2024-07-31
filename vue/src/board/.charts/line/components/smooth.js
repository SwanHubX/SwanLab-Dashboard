/**
 * Time Weighted EMA 平滑函数
 * @type {LineSmoothFunc}
 */
const twe = (data, value, detail, container) => {
  // 基础smoothingWeight
  const smoothingWeight = Math.min(Math.sqrt(value || 0), 0.999)
  // debias: 去偏见
  let debiasWeight = 0
  let lastY = data.metrics.length > 0 ? 0 : NaN
  const metrics = data.metrics
  metrics.forEach((metric, index) => {
    const prevX = index > 0 ? index - 1 : 0
    // VIEWPORT_SCALE scales the result to the chart's x-axis range
    const changeInX = metrics[index].index - metrics[prevX].index
    const smoothingWeightAdj = Math.pow(smoothingWeight, changeInX)
    lastY = lastY * smoothingWeightAdj + metrics[index].data
    debiasWeight = debiasWeight * smoothingWeightAdj + 1
    container.push({
      data: lastY / debiasWeight,
      index: metric.index,
      _last: metric._last,
      series: detail.series,
      detail
    })
  })
}

/**
 * 平滑字典，{@link SmoothType} -> {@link SmoothDetail}
 * @type {{'NULL':LineSmoothDetail, 'TWE':LineSmoothDetail, 'RA':LineSmoothDetail, 'GS':LineSmoothDetail}}
 */
export default {
  NULL: {
    type: 'NULL',
    name: 'No Smoothing'
  },
  TWE: {
    type: 'TWE',
    name: 'Time Weighted EMA',
    range: [0, 0.99],
    step: 0.01,
    func: twe
  },
  RA: {
    type: 'RA',
    name: 'Running Average',
    range: [1, 100],
    step: 1
  },
  GS: {
    type: 'GS',
    name: 'Gaussian Smoothing',
    range: [1, 100],
    step: 1
  }
}

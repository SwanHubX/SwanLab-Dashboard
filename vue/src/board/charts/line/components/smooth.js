/**
 * @typedef {'NULL' | 'TWE' | 'RA' | 'GS'} SmoothType 平滑类型, NULL表示不平滑，'TWE'表示Time Weighted EMA，'RA'表示Running Average，'GS'表示Gaussian Smoothing
 */

/**
 * 平滑函数通用接口
 * @typedef {(data:ScalarData ,value:Number, detail: import("./line").SeriesDetail, container: import("./line").LineData[] )=> void} SmoothFunc
 */

/**
 * Time Weighted EMA 平滑函数
 * @type {SmoothFunc}
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
 * @typedef {Object} SmoothDetail 平滑详细信息
 * @property {SmoothType} type 平滑类型
 * @property {String} name 平滑名称
 * @property {[Number, Number]} [range] 平滑参数范围，当type为NULL时，range为undefined
 * @property {0.01 | 0.1 | 1} [step] 平滑参数步长，当type为NULL时，step为undefined
 * @property {SmoothFunc} [func] 平滑函数，当type为NULL时，func为undefined
 */

/**
 * 平滑字典，{@link SmoothType} -> {@link SmoothDetail}
 * @type {{'NULL':SmoothDetail, 'TWE':SmoothDetail, 'RA':SmoothDetail, 'GS':SmoothDetail}}
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

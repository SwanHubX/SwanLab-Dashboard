/**
 * @typedef {'NULL' | 'TWE' | 'RA' | 'GS'} SmoothType 平滑类型, NULL表示不平滑，'TWE'表示Time Weighted EMA，'RA'表示Running Average，'GS'表示Gaussian Smoothing
 */

/**
 * @typedef {Object} SmoothDetail 平滑详细信息
 * @property {SmoothType} type 平滑类型
 * @property {String} name 平滑名称
 * @property {[Number, Number]} [range] 平滑参数范围，当type为NULL时，range为undefined
 * @property {0.01 | 0.1 | 1} [step] 平滑参数步长，当type为NULL时，step为undefined
 * @property {(data:import("./charts/line/components/line").LineData[] ,value:Number)=> import("./charts/line/components/line").LineData[]} [func] 平滑函数，当type为NULL时，func为undefined
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
    step: 0.01
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

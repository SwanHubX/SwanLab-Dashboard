/**
 * 这个数据类型的详细信息
 * @typedef {Object} LineSeriesDetail
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
 * @property {LineSeriesDetail} detail 数据配置，包含这个series的更多信息
 * @property {Boolean} _last 是否是最后一个点
 */

/**
 * 折线图悬浮信息
 * @typedef {Object} LineHoverInfo
 * @property {Number} x 悬浮坐标在折线图中的相对横坐标位置（基于折线图canvas左边）
 * @property {Number} y 悬浮坐标在折线图中的相对纵坐标位置（基于折线图canvas顶部）
 * @property {LineSeriesDetail} detail 当前悬浮信息距离哪个系列最近（非平滑系列）
 * @property {IndexId} cIndex 悬浮事件来源（来自哪个图表），用于防止栈溢出
 * @property {IndexId} sIndex 悬浮事件图表所属的序列
 * @property {Boolean} zoom 当前悬浮信息是否来自于zoom的图表，如果是则不触发粗细信息和悬浮信息的回调
 * @property {LineData[]} data 当前悬浮信息的数据，包含平滑系列数据
 */

/**
 * @typedef {'NULL' | 'TWE' | 'RA' | 'GS'} LineSmoothType 平滑类型, NULL表示不平滑，'TWE'表示Time Weighted EMA，'RA'表示Running Average，'GS'表示Gaussian Smoothing
 */

/**
 * 平滑函数通用接口
 * @typedef {(data:ScalarData ,value:Number, detail: LineSeriesDetail, container: LineData[] )=> void} LineSmoothFunc
 */

/**
 * @typedef {Object} LineSmoothDetail 平滑详细信息
 * @property {LineSmoothType} type 平滑类型
 * @property {String} name 平滑名称
 * @property {[Number, Number]} [range] 平滑参数范围，当type为NULL时，range为undefined
 * @property {0.01 | 0.1 | 1} [step] 平滑参数步长，当type为NULL时，step为undefined
 * @property {LineSmoothFunc} [func] 平滑函数，当type为NULL时，func为undefined
 */

/**
 * 折线图平滑信息
 * @typedef {Object} LineSmoothInfo
 * @property {LineSmoothDetail} detail 平滑具体参数
 * @property {Number} value 平滑值
 */

/**
 * 折线图粗细信息，所有的粗细信息都为被动触发，只需要设置此信息即可
 * @typedef {Object} LineThickInfo
 * @property {LineSeriesDetail} detail 当前加粗的系列
 * @property {Boolean} zoom 当前加粗信息是否来自于zoom的图表，如果是则只触发zoom的加粗回调
 */

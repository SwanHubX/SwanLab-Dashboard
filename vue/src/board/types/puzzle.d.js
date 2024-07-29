/**
 * ChartPuzzle模态框模式
 * @typedef {'zoom' | 'edit' | 'download' | null} ChartPuzzleModalMode
 */

/**
 * ChartPuzzle模态框事件，这些事件最大的特点是同时间只能触发一次，即同一时间只能有一个模态框
 * 因此此事件将放入状态管理中，由状态管理器触发
 * @callback ChartPuzzleModalEvent
 * @param {ChartPuzzleModalMode} m 模态框模式，这将决定模态框内部内容
 * @param {String} [cl] 模态框的类名，用于控制大小，注意必须是全局类名
 * @param {Object} [p] 传递给组件的props
 */

/**
 * ChartPuzzle模态框放大信息
 * @typedef {Object} ChartPuzzleModalZoomInfo
 * @property {MetricData[]} data 放大的数据
 */

// TODO: 未完全定义
// /**
//  * ChartPuzzle模态框编辑信息
//  * @typedef {Object} ChartPuzzleModalEditInfo
//  */

/**
 * ChartPuzzle模态框下载信息，目前的下载只单纯为下载折线图，这将在toolbar内部屏蔽其他图表的下载
 * @typedef {Object} ChartPuzzleModalDownloadInfo
 * @property {'png'} type 下载类型，目前只支持png
 */

/**
 * 存储在状态管理器中的模态框信息
 * @typedef {Object} ChartPuzzleModalInfo
 * @property {ChartPuzzleModalMode} mode 模态框模式
 * @property {Chart} chart 模态框所属的图表配置
 * @property {String} [cl] 模态框的类名，必须为全局类名，用于处理模态框样式
 * @property {ChartPuzzleModalZoomInfo} [zoom] 模态框放大信息
 * @property {ChartPuzzleModalDownloadInfo} [download] 模态框下载信息
 */

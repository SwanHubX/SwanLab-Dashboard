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

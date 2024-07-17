import { useBoardStore } from '../store'

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

/**
 * 渲染函数，定义函数渲染逻辑
 * @callback RenderFunction
 * @param {MetricId[]} metricIds 此函数所关心的指标
 * @param {import('../store').MetricStore} metricsData 所有指标的数据
 * @returns {void}
 */

/**
 * 此函数只能在setup中调用
 * 用于创建一个渲染函数，在所需指标发生变化时触发回调，如果在创建时指标已经存在，则会立即触发回调
 * 回调函数将会有防抖措施
 * @param {MetricId[]} metricIds 渲染所关心的指标
 * @param {RenderFunction} callback 渲染函数
 */
export const createRender = (metricIds, callback) => {
  const boardStore = useBoardStore()
  /** @type {'idle' | 'busy' | 'cancel'} 渲染状态 */
  let state = 'idle'
  // 防抖需要使用Promise实现
  const debounced = async (delay = 500) => {
    if (state === 'busy' || state == 'cancel') return
    await new Promise((resolve) => {
      state = 'busy'
      setTimeout(() => {
        resolve()
      }, delay)
    })
      .then(() => callback(metricIds, boardStore.metrics))
      .finally(() => {
        state = 'idle'
      })
  }
  /** 从store中获取指标数据 */
  const getMetricsFromStore = () => {
    const newMetrics = {}
    for (const metricId of metricIds) {
      // 按需获取指标数据
      if (boardStore.metrics[metricId.experimentId] && boardStore.metrics[metricId.experimentId][metricId.key]) {
        newMetrics[metricId.experimentId] = newMetrics[metricId.experimentId] || {}
        newMetrics[metricId.experimentId][metricId.key] = boardStore.metrics[metricId.experimentId][metricId.key]
      }
    }
    return newMetrics
  }

  boardStore.$onAction((...args) => {
    // TODO 只有当命中的指标发生变化时，才会触发回调

    metrics.value = getMetricsFromStore()
  })
  // onErrorCaptured 钩子只能在以下情况下使用：
  // 组件渲染
  // 事件处理器
  // 生命周期钩子
  // setup() 函数
  // 侦听器
  // 自定义指令钩子
  // 过渡钩子
  // 所以需要有一个watch监听器转译onAction事件更改
  /** @type {import('vue').ShallowRef<import('../store').MetricStore> } */
  const metrics = shallowRef({})
  // 监听metrics变化，变化时触发debounced回调
  const stop = watch(metrics, async () => {
    console.log('metrics changed')
    await debounced().catch((err) => {
      // 如果出现错误，停止监听
      stop()
      state = 'cancel'
      throw err
    })
  })
  // 初次create时判断是否需要立即触发回调
  setTimeout(() => {
    const preMetrics = getMetricsFromStore()
    if (Object.entries(preMetrics).length) metrics.value = preMetrics
  }, 0)
}

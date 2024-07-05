import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import http from '@swanlab-vue/api/http'

export const useChartStore = defineStore('chart', () => {
  /**
   * 媒体文件获取函数
   * @param { string } data 即文件名，即数据中的data字段
   * @param { string } experiment_id 实验id
   * @param { string } tag 数据名称
   * @returns { Promise<Blob> } Promise对象，最终可返回blob对象
   */
  let _mediaHandler = null
  /**
   * 获取媒体文件，获取blob对象
   * 返回promise，如果成功，返回blob对象，否则返回错误信息
   */
  const media = {
    /**
     * 获取媒体文件，获取blob对象
     * 返回promise，如果成功，返回blob对象，否则返回错误信息
     * @param { string } data 即文件名，即数据中的data字段
     * @param { string } experiment_id 实验id
     * @param { string } tag 数据名称
     * @returns { Promise<Blob> }
     */
    get: async (data, experiment_id, tag) => {
      return await _mediaHandler(data, experiment_id, tag)
    }
  }

  // ---------------------------------- states ----------------------------------

  /**
   * @type { Section[] } 分组信息
   */
  const sections = ref([])
  /**
   * @type { Chart[] } 图表信息
   */
  const charts = ref([])
  /**
   * @type { MetricStore } 指标信息
   */
  const keys = {}

  // ---------------------------------- actions ----------------------------------

  /**
   * 初始化设置 section 和 chart，同时设置 media 的获取函数
   * @param { Object } data 初始化数据，包含 section 和 chart 的配置信息
   * @param { Function } mediaHandler 媒体文件获取函数
   * @param { Boolean } local 是否是本地数据，若为本地数据则启动本地数据格式化
   */
  const init = (data, mediaHandler, local = false) => {
    if (local) [sections.value, charts.value] = _formatLocalData(data)
    else [sections.value, charts.value] = data
    _mediaHandler = mediaHandler
  }

  /**
   * 更新命名空间展开状态
   * @param { boolean } opened 是否展开
   * @param { object } namespace 命名空间对象
   * @returns { Promise }
   */
  const updateNamespaceStatus = (opened, namespace) => {
    return http.patch('/namespace/' + namespace.id + '/opened', {
      experiment_id: namespace.experiment_id?.id,
      project_id: namespace.project_id?.id,
      opened
    })
  }

  /**
   * 更新chart状态，置顶、隐藏或正常显示
   * @param { object } chart 图表对象
   * @param { int } status 状态码，0为正常，1为置顶，-1为隐藏
   * @returns { Promise } Promise对象，最终可返回更新后的图表组织结构
   */
  const updateChartStatus = async (chart, status) => {
    const { data } = await http.patch('/chart/' + chart.id + '/status', {
      status
    })
    return data
  }

  return {
    // states
    media,
    sections,
    charts,
    keys,
    // actions
    updateNamespaceStatus,
    updateChartStatus,
    init,
    setData
  }
})

const _generateXAxis = () => {
  return {
    class: 'SYSTEM',
    error: null,
    key: 'step',
    name: 'step',
    type: 'FLOAT'
  }
}

const _generateYAxis = (key, name, type) => {
  return {
    class: 'CUSTOM',
    error: null,
    key,
    name,
    type
  }
}

/**
 * @typedef { Object } FormatData 转化后的本地数据
 * @property { Section[] } sections 分组列表
 * @property { Chart[] } charts 图表列表
 */

/**
 * 针对本地版进行数据格式化
 * @param { object } data
 * @param { Array } data.namespaces 命名空间
 * @param { Array } data.charts 图表
 * @returns { FormatData } 格式化后的数据
 */
const _formatLocalData = ({ namespaces, charts }) => {
  const temp_sections = namespaces.map((ns) => {
    const temp = {
      type: ns.type,
      name: ns.name,
      chartIndex: ns.charts,
      pinned: ns.opened === 1,
      folded: ns.opened === 0,
      config: ns.more,
      index: ns.id
    }
    if (ns.name === 'pinned' && ns.id === -1) temp.type = 'PINNED'
    else if (ns.name === 'hidden' && ns.id === -2) temp.type = 'HIDDEN'
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
    const yAxis = _generateYAxis(temp.title, temp.title, temp.type)
    const xAxis = _generateXAxis()
    if (temp.type === 'LINE') {
      temp.config = {
        xAxis,
        xTitle: 'Step',
        yAxis: [yAxis],
        yTitle: chart.name
      }
    }
    temp.metrics.push({
      axis: 'X',
      column: xAxis,
      colors: [],
      name: 'summary'
    })
    chart.source.forEach((m) => {
      temp.metrics.push({
        axis: 'Y',
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

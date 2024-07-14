import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '@swanlab-vue/api/http'
import { formatLocalData } from '@swanlab-vue/utils/chart'

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
  const sections = ref()
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
    // 本地版数据格式化
    if (local) [sections.value, charts.value] = formatLocalData(data)
    // 云端版数据格式化
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
    init
  }
})

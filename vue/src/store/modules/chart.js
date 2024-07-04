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

  const sections = ref([])
  const charts = ref([])
  const tags = ref([])

  // ---------------------------------- actions ----------------------------------

  const init = (mediaHandler) => {
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

  const setData = (data, format) => {
    console.log('=======================================')
    if (format) {
      _formatData(data)
      console.log(sections.value)
      return
    }
    console.log(data)
    console.log(format ? _formatData(data) : data)
  }

  /**
   * 针对本地版进行数据格式化
   * @param { object } data
   * @param { Array } data.namespaces 命名空间
   * @param { Array } data.charts 图表
   * @returns { object } 格式化后的数据
   */
  const _formatData = ({ namespaces, charts }) => {
    sections.value = namespaces.map((ns) => {
      const temp = {
        type: ns.type,
        name: ns.name,
        chartsIndex: ns.charts,
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
  }

  return {
    media,
    sections,
    charts,
    tags,
    updateNamespaceStatus,
    updateChartStatus,
    init,
    setData
  }
})

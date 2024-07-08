import { describe, expect, it } from 'vitest'
import { formatLocalData } from '@swanlab-vue/utils/chart'
import { nanoid, customAlphabet } from 'nanoid'

/**
 * 随机生成一个数组，长度在1-20之间，元素值在1-200之间
 * @returns {number[] | string[]} array
 */
const generateRandomArray = (type = 'number', length) => {
  const arrayLength = length || Math.floor(Math.random() * 20) + 1
  const array = []
  for (let i = 0; i < arrayLength; i++) {
    const value = type === 'number' ? Math.floor(Math.random() * 200) + 1 : nanoid(10)
    array.push(value)
  }
  return array
}

/**
 * 生成一个本地后端返回的原始 namespace 数据
 * @param {number} id
 * @param {string} name
 * @param {boolean} opened
 * @returns {object} namespace
 */
const originalNamespace = (id = 1, name = 'test', opened = 1) => {
  const time = new Date().toISOString()
  return {
    charts: generateRandomArray(),
    create_time: time,
    description: nanoid(),
    experiment_id: {},
    id,
    more: null,
    name,
    opened,
    project_id: null,
    sort: 1,
    update_time: time
  }
}

const originalChart = (type = 'default', name = 'test', multi = false, reference = 'step') => {
  const time = new Date().toISOString()
  const source = generateRandomArray('string', 1)
  const source_map = {}
  source.forEach((item) => {
    source_map[item] = customAlphabet('123456789', 4)()
  })
  return {
    id: nanoid(4),
    type,
    name,
    multi,
    reference,
    source,
    source_map,
    experiment_id: multi ? null : {},
    project_id: multi ? {} : null,
    create_time: time,
    update_time: time
  }
}

describe('formatLocalData => sections', () => {
  const checkSections = (sections, namespaces) => {
    sections.forEach((section, index) => {
      const ns = namespaces[index]
      expect(section.index).toEqual(ns.id)
      expect(section.name).toEqual(ns.name)
      expect(section.pinned).toEqual(ns.id === -1 && ns.name === 'pinned')
      expect(section.folded).toEqual(ns.opened === 0)
      expect(section.chartIndex).toEqual(ns.charts)
      expect(section.config).toEqual(ns.more)
    })
  }

  it('empty sections', () => {
    const [sections] = formatLocalData({ namespaces: [], charts: [] })
    expect(sections).to.deep.equal([])
  })

  it('sections without hide or pin', () => {
    const namespaces = [originalNamespace(), originalNamespace(1, 'test', 0), originalNamespace()]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections, namespaces)
  })

  it('pinned namespace', () => {
    const namespaces = [originalNamespace(-1, 'pinned', 1), originalNamespace(2, 'test', 1)]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections, namespaces)
  })

  it('hidden namespace', () => {
    const namespaces = [originalNamespace(-2, 'hidden', 0), originalNamespace(2, 'test', 1)]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections, namespaces)
  })
})

describe('formatLocalData => charts', () => {
  const checkCharts = (charts, originalCharts) => {
    charts.forEach((chart, index) => {
      const oc = originalCharts[index]
      expect(chart.index).toEqual(oc.id)
      expect(chart.type).toEqual(oc.type === 'default' ? 'LINE' : oc.type)
      expect(chart.title).toEqual(oc.name)

      chart.metrics.forEach((metric, index) => {})
    })
  }

  it('empty charts', () => {
    const charts = formatLocalData({ namespaces: [], charts: [] })[1]
    expect(charts).to.deep.equal([])
  })

  it('charts in experiment page', () => {
    const originalCharts = [originalChart(), originalChart('LINE'), originalChart('IMAGE')]
    const charts = formatLocalData({ namespaces: [], charts: originalCharts })[1]
    console.log(charts)
    checkCharts(charts, originalCharts)
  })
})

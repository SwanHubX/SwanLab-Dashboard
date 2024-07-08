import { describe, expect, it } from 'vitest'
import { formatLocalData } from '@swanlab-vue/utils/chart'
import { nanoid, customAlphabet } from 'nanoid'

/// <reference path="../../src/docs/chart.js" />

/**
 * @type { OriginalChart } c
 */
const c = {}

/**
 * 随机生成一个数组，长度在1-20之间，元素值在1-200之间
 * @returns { number[] | string[] } array
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
 * @param { number } id
 * @param { string } name
 * @param { boolean } opened
 * @returns { Namespace } namespace
 */
const mockOriginalNamespace = (id = 1, name = 'test', opened = 1) => {
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

/**
 * 生成原始 chart 数据
 * @param { 'default' | 'LINE' | 'IMAGE' | 'TEXT' | 'IMAGE' } type
 * @param { boolean } multi
 * @param { string } name
 * @param { string } reference
 * @returns
 */
const mockOriginalChart = (type = 'default', multi = false, name, reference = 'step') => {
  name = name || nanoid(5)
  const time = new Date().toISOString()
  const source = generateRandomArray('string', multi ? null : 1)
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
    const namespaces = [mockOriginalNamespace(), mockOriginalNamespace(1, 'test', 0), mockOriginalNamespace()]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections, namespaces)
  })

  it('pinned namespace', () => {
    const namespaces = [mockOriginalNamespace(-1, 'pinned', 1), mockOriginalNamespace(2, 'test', 1)]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections, namespaces)
  })

  it('hidden namespace', () => {
    const namespaces = [mockOriginalNamespace(-2, 'hidden', 0), mockOriginalNamespace(2, 'test', 1)]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections, namespaces)
  })
})

describe('formatLocalData => charts', () => {
  /**
   *
   * @param { OriginalChart[] } charts
   * @param {*} originalCharts
   */
  const checkCharts = (charts, originalCharts) => {
    charts.forEach((chart, index) => {
      const oc = originalCharts[index]
      expect(chart.index).toEqual(oc.id)
      expect(chart.type).toEqual(oc.type === 'default' ? 'LINE' : oc.type)
      expect(chart.title).toEqual(oc.name)

      /**
       * 如果是单实验
       * 1. 折线图：有两个指标，以 X 标识进度坐标,以 Y 标识指标值
       * 2. 其他图表：只有一个指标，即当前tag，以 X 标识
       */
      if (!originalCharts[index].multi) {
        if (chart.type === 'LINE') {
          expect(chart.metrics.length).toEqual(2)
          // 在 metrics 中含有以 X 标识的指标
          expect(chart.metrics.some((metric) => metric.axis === 'X')).toBe(true)
        } else expect(chart.metrics.length).toEqual(1)
      }
      chart.metrics.forEach((metric) => {
        expect(metric).toMatchObject({
          axis: expect.enum(['X', 'Y']),
          colors: expect.any(Array),
          expId: expect.any(String),
          name: expect.any(String)
        })
        // expect(metric)
        // if(!chart.multi) {
        //   // 如果是单实验，那么 metric 的
        // }
      })
    })
  }

  const typeList = ['default', 'LINE', 'IMAGE', 'TEXT', 'AUDIO']

  it('empty charts', () => {
    const charts = formatLocalData({ namespaces: [], charts: [] })[1]
    expect(charts).to.deep.equal([])
  })

  it('charts with single mode', () => {
    const originalCharts = []
    typeList.forEach((type) => originalCharts.push(mockOriginalChart(type)))
    const charts = formatLocalData({ namespaces: [], charts: originalCharts })[1]
    checkCharts(charts, originalCharts)
  })

  it('charts with multi mode', () => {
    const originalCharts = []
    typeList.forEach((type) => originalCharts.push(mockOriginalChart(type, true)))
    const charts = formatLocalData({ namespaces: [], charts: originalCharts })[1]
    checkCharts(charts, originalCharts)
  })
})

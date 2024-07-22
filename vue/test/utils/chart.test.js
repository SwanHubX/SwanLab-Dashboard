import { describe, expect, it } from 'vitest'
import { formatLocalData } from '@swanlab-vue/utils/chart'
import { nanoid, customAlphabet } from 'nanoid'

/** @typedef { Array<number | string> } RandomArray */

/** @typedef {"default" | "line" | "image" | "text" | "audio"} ChartType */

/**
 * 随机生成一个数组，长度在1-20之间，元素值在1-200之间
 * @param { 'number' | 'string' } type
 * @param { number } length
 * @returns {RandomArray} array
 */
const generateRandomArray = (type = 'number', length = undefined) => {
  const arrayLength = length || Math.floor(Math.random() * 20) + 1
  /** @type {RandomArray} */
  const array = []
  for (let i = 0; i < arrayLength; i++) {
    /** @type {string | number} */
    const value = type === 'number' ? Math.floor(Math.random() * 200) + 1 : nanoid(10)
    array.push(value)
  }
  return array
}

/**
 * @param {number} [length=5] 数据长度
 * @returns {import('@swanlab-vue/utils/chart').OriginalSource[]} 随机生成的数据
 */
const generateRandomSource = (length = 5) => {
  return generateRandomArray('number', length).map(() => ({
    experiment_id: nanoid(),
    key: nanoid()
  }))
}

/**
 * 生成一个本地后端返回的原始 namespace 数据
 * @param { number } id
 * @param { string } name
 * @param { number } opened
 * @returns { import('@swanlab-vue/utils/chart').OriginalNamespace } namespace
 */
const mockOriginalNamespace = (id = 1, name = 'test', opened = 1) => {
  const time = new Date().toISOString()
  return {
    charts: generateRandomArray().map((item) => Number(item)),
    created_time: time,
    description: nanoid(),
    experiment_id: {},
    id,
    more: null,
    name,
    opened,
    project_id: null,
    sort: 1,
    updated_time: time
  }
}

/**
 * 生成原始 chart 数据
 * @param { ChartType } type
 * @param { boolean } multi
 * @param { string } reference
 * @param { number } sourceLength
 * @returns { import('@swanlab-vue/utils/chart').OriginalChart }
 */
const mockOriginalChart = (type = 'default', multi = false, reference = 'step', sourceLength = 1) => {
  const time = new Date().toISOString()
  const source = generateRandomSource(sourceLength)
  return {
    id: Number(customAlphabet('123456789', 4)()),
    type,
    name: type,
    description: nanoid(),
    config: null,
    more: null,
    sort: 1,
    status: 0,
    system: multi ? 0 : 1,
    error: null,
    multi,
    reference,
    source,
    experiment_id: multi ? null : {},
    project_id: multi ? {} : null,
    created_time: time,
    updated_time: time
  }
}

describe('formatLocalData => sections', () => {
  /**
   * 检测转化后的 section 数据
   * @param { Section[] } sections
   * @param { import('@swanlab-vue/utils/chart').OriginalNamespace[] } namespaces
   */
  const checkSections = (sections, namespaces) => {
    sections.forEach((section, index) => {
      const ns = namespaces[index]
      expect(section.index).toEqual(String(ns.id))
      expect(section.name).toEqual(ns.name)
      expect(section.folded).toEqual(ns.opened === 0)
      expect(section.chartIndex).toEqual(ns.charts.map((item) => String(item)))
      expect(section.config).toEqual(ns.more)
    })
  }

  it('没有 section', () => {
    const [sections] = formatLocalData({ namespaces: [], charts: [] })
    expect(sections).to.deep.equal([])
  })

  it('自动生成 PINNED 和 HIDDEN', () => {
    const namespaces = [mockOriginalNamespace(), mockOriginalNamespace(1, 'test', 0), mockOriginalNamespace()]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections.slice(1, -1), namespaces)
    expect(sections[0].type).toEqual('PINNED')
    expect(sections[0].folded).toEqual(false)
    expect(sections[0].chartIndex.length).toEqual(0)
    expect(sections[4].type).toEqual('HIDDEN')
    expect(sections[4].folded).toEqual(true)
    expect(sections[4].chartIndex.length).toEqual(0)
  })

  it('有 PINNED，自动生成 HIDDEN', () => {
    const namespaces = [mockOriginalNamespace(-1, 'pinned', 1), mockOriginalNamespace(2, 'test', 1)]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections.slice(0, -1), namespaces)
    expect(sections[2].type).toEqual('HIDDEN')
    expect(sections[2].chartIndex.length).toEqual(0)
    expect(sections[2].folded).toEqual(true)
  })

  it('有 HIDDEN，自动生成 PINNED', () => {
    const namespaces = [mockOriginalNamespace(-2, 'hidden', 0), mockOriginalNamespace(2, 'test', 1)]
    const [sections] = formatLocalData({ namespaces, charts: [] })
    checkSections(sections.slice(1, -2), namespaces)
    expect(sections[0].type).toEqual('PINNED')
    expect(sections[0].chartIndex.length).toEqual(0)
    expect(sections[0].folded).toEqual(false)
  })

  it('媒体 section 和普通 section', () => {
    const medias = ['image', 'audio', 'text', 'media']
    const namespaces = medias.map((name) => mockOriginalNamespace(Number(customAlphabet('123456789', 4)()), name))
    const [sections] = formatLocalData({ namespaces, charts: [] })
    sections.forEach((section) => {
      // 媒体类型的空间默认 3 列,高度300
      expect(section.cols).toEqual(3)
      expect(section.rowHeight).toEqual(272)
    })
    const commonNamespaces = [mockOriginalNamespace()]
    const [commonSections] = formatLocalData({ namespaces: commonNamespaces, charts: [] })
    commonSections.forEach((section) => {
      // 普通类型的空间默认 3 列,高度400
      expect(section.cols).toEqual(3)
      expect(section.rowHeight).toEqual(272)
    })
  })
})

describe('formatLocalData => charts', () => {
  /**
   * 检查转化后的图标数据是否合规
   * @param { Chart[] } charts 转化之后的图表
   * @param { import('@swanlab-vue/utils/chart').OriginalChart[] } originalCharts 原始图表
   */
  const checkCharts = (charts, originalCharts) => {
    charts.forEach((chart, index) => {
      const oc = originalCharts[index]
      expect(chart.index).toEqual(String(oc.id))
      expect(chart.type).toEqual(oc.type === 'default' ? 'LINE' : oc.type.toUpperCase())
      expect(chart.title).toEqual(oc.name)
      expect(chart.colors).toEqual(['#528d59', '#528d59'])
      /** @type { Metric[] } */
      const metrics = chart.metrics
      /**
       * 如果是单实验
       * 1. 折线图：有两个指标，以 X 标识进度坐标,以 Y 标识指标值
       * 2. 其他图表：只有一个指标，即当前tag，以 X 标识
       */
      if (!originalCharts[index].multi) {
        if (chart.type === 'LINE') {
          expect(metrics.length).toEqual(2)
          // 在 metrics 中含有以 X 标识的指标
          expect(metrics.some((metric) => metric.axis === 'X')).toBe(true)
        } else expect(metrics.length).toEqual(1)
      }
      // 遍历指标数据
      metrics.forEach((metric) => {
        // ---------------------------------- metric 相关 ----------------------------------
        expect(metric).toMatchObject({
          axis: expect.stringMatching(new RegExp(`^(X|Y)$`)),
          colors: expect.any(Array),
          name: expect.any(String)
        })
        // 如果是这线图，并且分类为X，那么该指标没有expId，且名字为 summary
        if (chart.type === 'LINE' && metric.axis === 'X') {
          expect(metric.expId).toBeUndefined()
          expect(metric.name).toEqual('summary')
        }
        // 如果是多媒体图标，那么只有 X 标识，没有 Y 标识
        else if (chart.type === 'IMAGE' || chart.type === 'TEXT' || chart.type === 'AUDIO') {
          expect(metric.axis).toEqual('X')
        }
        // 除了这线图的系统指标，都有 expId，需要以此为索引之一寻找数据源
        else expect(metric.expId).toEqual(expect.any(String))
        // ---------------------------------- column 相关 ----------------------------------
        // 如果是这线图，则有一个以 X 标识的指标，其中 class 为 SYSTEM，key 为 step
        // 且这线图的所有指标都是 FLOAT 类型
        const isSys = chart.type === 'LINE' && metric.axis === 'X'
        expect(metric.column.class).toEqual(isSys ? 'SYSTEM' : 'CUSTOM')
        expect(metric.column.error).toEqual(null)
        expect(metric.column.key).toEqual(isSys ? 'step' : chart.title)
        expect(metric.column.type).toEqual(chart.type === 'LINE' ? 'FLOAT' : chart.type)
      })
    })
  }

  /**
   * 生成各个类别的原始图表数据
   * @param { Boolean } multi 是否是多试验图表
   * @returns { import('@swanlab-vue/utils/chart').OriginalChart[] } 原始图表数据
   */
  const mockOriginalCharts = (multi) => {
    const types = ['default', 'line', 'image', 'text', 'audio']
    return types.map((/** @type {ChartType} */ type) => mockOriginalChart(type, multi))
  }

  it('empty charts', () => {
    const charts = formatLocalData({ namespaces: [], charts: [] })[1]
    expect(charts).to.deep.equal([])
  })

  it('charts with single experiment', () => {
    const originalCharts = mockOriginalCharts(false)
    const charts = formatLocalData({ namespaces: [], charts: originalCharts })[1]
    checkCharts(charts, originalCharts)
  })

  it('charts with multi experiments', () => {
    const originalCharts = mockOriginalCharts(true)
    const charts = formatLocalData({ namespaces: [], charts: originalCharts })[1]
    checkCharts(charts, originalCharts)
  })

  /**
   * 给图表模拟错误信息
   * @param { import('@swanlab-vue/utils/chart').OriginalChart } oc
   */
  const mockErrorChart = (oc) => {
    oc.source.forEach((s) => {
      oc.error = {
        ...(oc.error || {}), // error 可能为obj或null
        [s.key]: {
          data_class: nanoid(5),
          excepted: nanoid(5)
        }
      }
    })
  }

  /**
   * 检查转化后的图标数据是否合规
   * @param { Chart[] } charts 转化之后的图表
   * @param { import('@swanlab-vue/utils/chart').OriginalChart[] } originalCharts 原始图表
   */
  const checkErrorCharts = (charts, originalCharts) => {
    charts.forEach((chart) => {
      const oc = originalCharts.find((c) => c.id === Number(chart.index))
      Object.keys(oc.error).forEach((key) => {
        const metric = chart.metrics.find((m) => m.name === key)
        expect(metric.column.error).toEqual(oc.error[key])
      })
    })
  }

  it('error chart with single experiment', () => {
    const originalCharts = mockOriginalCharts(false)
    originalCharts.forEach(mockErrorChart)
    const charts = formatLocalData({ namespaces: [], charts: originalCharts })[1]
    checkErrorCharts(charts, originalCharts)
  })

  it('error chart with multi experiment', () => {
    const originalCharts = mockOriginalCharts(true)
    originalCharts.forEach(mockErrorChart)
    const charts = formatLocalData({ namespaces: [], charts: originalCharts })[1]
    checkErrorCharts(charts, originalCharts)
  })
})

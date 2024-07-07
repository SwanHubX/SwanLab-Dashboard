import { describe, expect, it } from 'vitest'
import { formatLocalData } from '@swanlab-vue/utils/chart'
import { nanoid } from 'nanoid'

const generateRandomArray = () => {
  const arrayLength = Math.floor(Math.random() * 20) + 1
  const array = []
  for (let i = 0; i < arrayLength; i++) {
    array.push(Math.floor(Math.random() * 200) + 1)
  }
  return array
}

const originalNamespace = () => {
  const time = new Date().toISOString()
  return {
    charts: generateRandomArray(),
    create_time: time,
    description: null,
    experiment_id: {},
    id: 1,
    more: null,
    name: 'test',
    opened: 1,
    project_id: null,
    sort: 1,
    update_time: time
  }
}
const originalChart = {}

describe('formatLocalData', () => {
  it('empty data', () => {
    const { sections, charts } = formatLocalData({ namespaces: [], charts: [] })
    expect(sections).to.deep.equal([])
    expect(charts).to.deep.equal([])
  })

  it('namespaces with single experiment', () => {
    const namespaces = [originalNamespace, originalNamespace, originalNamespace]
    const { sections } = formatLocalData({ namespaces, charts: [] })
    sections.forEach((section, index) => {
      const ns = namespaces[index]
      expect(section.charts).toEqual(ns.charts)
      expect(section.name).toEqual(ns.name)
      expect(section.index).toEqual(ns.id)
      expect(section.pinned).toEqual(false)
      expect(section.folded).toEqual(ns.opened === 1)
    })
  })
})

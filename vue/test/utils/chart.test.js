import { describe, expect, it } from 'vitest'
import { formatLocalData } from '@swanlab-vue/utils/chart'

describe('formatLocalData', () => {
  it('empty data', () => {
    const { sections, charts } = formatLocalData({ namespaces: [], charts: [] })
    expect(sections).to.deep.equal([])
    expect(charts).to.deep.equal([])
  })
})

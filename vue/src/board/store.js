import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBoardStore = defineStore('board', () => {
  // ---------------------------------- ststes ----------------------------------
  /** @type { import('vue').Ref<Section[]> } */
  const sections = ref([])
  /** @type { import('vue').Ref<Chart[]> } */
  const charts = ref([])

  // ---------------------------------- actions ----------------------------------

  /**
   * 初始化数据
   * @param { Section[] } s
   * @param { Chart[] } c
   */
  const init = (s, c) => {
    sections.value = s
    charts.value = c
  }

  return {
    // state
    sections,
    charts,
    // action
    init
  }
})

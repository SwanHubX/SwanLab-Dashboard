<template>
  <div class="board-toolbar">
    <InputSearch
      :placeholder="$t('chart.toolbar.search.placeholder')"
      class="board-search"
      v-model:value="value"
      @search="handleSearch"
      @change="handleChange"
    />
    <!-- 刷新按钮 -->

    <!-- smooth配置 -->
    <Dropdown class="board-smooth" :trigger="['click']" :arrow="true" v-model:open="open">
      <button class="smooth-button" @click.prevent>
        <SlidersOutlined />
      </button>
      <template #overlay>
        <Menu style="width: 380px; display: flex" class="flex-col gap-2">
          <!-- 平滑slider -->
          <div class="smooth-item">
            <p class="smooth-item-title">{{ $t('chart.toolbar.smooth.level') }}</p>
            <div class="smooth-item-content flex items-center gap-2">
              <div class="w-3/4">
                <Slider
                  v-model:value="param"
                  :min="smoothDetail.range?.[0]"
                  :max="smoothDetail.range?.[1]"
                  :step="smoothDetail.step"
                  :disabled="!smoothDetail.range"
                  :tooltip-open="false"
                />
              </div>
              <div class="w-1/4">
                <InputNumber
                  style="width: 100%"
                  size="small"
                  v-model:value="param"
                  :min="smoothDetail.range?.[0]"
                  :max="smoothDetail.range?.[1]"
                  :step="smoothDetail.step"
                  :disabled="!smoothDetail.range"
                />
              </div>
            </div>
          </div>
          <!-- 选择平滑方式 -->
          <div class="smooth-item">
            <p class="smooth-item-title">{{ $t('chart.toolbar.smooth.method') }}</p>
            <div class="smooth-item-content">
              <Select ref="select" v-model:value="method" style="display: flex">
                <SelectOption v-for="detail in S" :key="detail.type" :value="detail.name">
                  {{ detail.name }}
                </SelectOption>
              </Select>
            </div>
          </div>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<script setup>
/**
 * @description: 图表看板工具栏
 * @file: BoardToolBar.vue
 * @since: 2024-07-23 14:57:26
 **/
import S from '../smooth'
import { InputSearch, Dropdown, Menu, Slider, Select, SelectOption, InputNumber } from 'ant-design-vue'
import { SlidersOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  refresh: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['refresh', 'filter'])

// ---------------------------------- 搜索 ----------------------------------

const value = ref('')

const handleSearch = () => {
  emits('filter', value.value)
}

const handleChange = () => {
  emits('filter', value.value)
}

// ---------------------------------- 刷新 ----------------------------------

// ---------------------------------- 平滑 ----------------------------------
const open = ref(false)
// 默认平滑方式
const method = ref(S.NULL.name)
/** @type {ComputedRef<import('../smooth').SmoothDetail>} */
const smoothDetail = computed(() => S[Object.keys(S).find((key) => S[key].name === method.value)])
const param = ref(0)
watch(smoothDetail, () => {
  param.value = smoothDetail.value.range?.[0] ?? 0
})
</script>

<style lang="scss" scoped>
.board-toolbar {
  @apply border-b sticky top-0 bg-higher flex px-4 py-3;
  @apply items-center justify-between;
  @apply md:flex hidden;
  z-index: 999;
}

// 搜索框样式配置
.board-search {
  .ant-input-search-button {
    display: flex !important;
  }
}

.smooth-button {
  @apply h-8 w-8 flex items-center justify-center text-2xl hover:text-positive-default hover:bg-positive-dimmer;
  @apply rounded text-dimmer;
}

.smooth-item {
  @apply flex items-center gap-2 h-8 px-2 my-1;
  .smooth-item-title {
    @apply w-20 font-semibold;
  }
  .smooth-item-content {
    @apply flex-1;
  }
}
</style>

<style lang="scss">
.board-search {
  @apply max-w-60;
  .ant-input-search-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

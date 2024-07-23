<template>
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
</template>

<script>
/**
 * @typedef {(detail:import('../charts/line/components/smooth').SmoothDetail, param: Number )=>void} SmoothEmit
 */
</script>

<script setup>
/**
 * @description: 平滑组件
 * @file: SmoothComponent.vue
 * @since: 2024-07-23 17:54:32
 **/

import S from '../charts/line/components/smooth'
import { Dropdown, Menu, Slider, Select, SelectOption, InputNumber } from 'ant-design-vue'
import { SlidersOutlined } from '@ant-design/icons-vue'

const emits = defineEmits(['smooth'])

const open = ref(false)
// 默认平滑方式
const method = ref(S.TWE.name)
/** @type {ComputedRef<import('../charts/line/components/smooth').SmoothDetail>} */
const smoothDetail = computed(() => S[Object.keys(S).find((key) => S[key].name === method.value)])
const param = ref(0)
watch(smoothDetail, () => {
  param.value = smoothDetail.value.range?.[0] ?? 0
})

watch([param, smoothDetail], () => {
  emits('smooth', smoothDetail.value, param.value)
})
</script>

<style lang="scss" scoped>
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

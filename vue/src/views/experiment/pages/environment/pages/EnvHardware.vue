<template>
  <div class="w-full border p-6 rounded-lg bg-default" v-if="isShow">
    <h1 class="w-full text-xl font-semibold pb-4 border-b">{{ $t('experiment.env.title.hardware') }}</h1>
    <AppleChip :data="data.apple" v-if="isApple" />
    <EnvGroup :title="$t('experiment.env.groups.cpu')" :data="data.cpu" v-if="hasCPU && !isApple" />
    <EnvGroup :data="data.memory" v-if="hasMem && !isApple" />
    <NvidiaGpu :data="data.nvidia" type="nvidia" v-if="data.nvidia" />
    <NvidiaGpu :data="data.gpu" type="gpu" v-else-if="data.gpu" />
  </div>
  <div v-else>
    <p class="text-center pt-5">{{ $t('experiment.env.empty.hardware') }}</p>
  </div>
</template>

<script setup>
/**
 * @description: 系统硬件信息
 * @file: EnvHardware.vue
 * @since: 2024-01-24 21:19:24
 **/
import { computed } from 'vue'
import { useExperimentStore } from '@swanlab-vue/store'
import EnvGroup from '../components/EnvGroup.vue'
import { getHardwareData } from '@swanlab-vue/views/experiment/pages/environment/components/parser.js'
import NvidiaGpu from '@swanlab-vue/views/experiment/pages/environment/components/hardware/NvidiaGpu.vue'
import AppleChip from '@swanlab-vue/views/experiment/pages/environment/components/hardware/AppleChip.vue'
const { experiment } = useExperimentStore()

// 系统硬件信息
const data = computed(() => getHardwareData(experiment))
const isApple = computed(() => data.value?.apple)
// 是否有基础信息
const hasData = (target) => {
  if (!target) return false
  return target?.filter((item) => item.value).length > 0
}
const hasCPU = computed(() => hasData(data.value.cpu))
const hasMem = computed(() => hasData(data.value.memory))
const isShow = computed(() => {
  return data.value.apple || hasCPU.value || hasMem.value || data.value.gpu
})
</script>

<style lang="scss" scoped></style>

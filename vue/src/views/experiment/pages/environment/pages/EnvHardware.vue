<template>
  <div class="w-full border p-6 rounded-lg bg-default">
    <h1 class="w-full text-xl font-semibold pb-4 border-b">{{ $t('experiment.env.title.hardware') }}</h1>
    <EnvGroups :title="$t('experiment.env.groups.cpu')" :data="data.cpu" />
    <EnvGroups :data="data.memory" />
    <NvidiaGpu :data="data.nvidia" type="nvidia" v-if="data.nvidia" />
    <NvidiaGpu :data="data.gpu" type="gpu" v-if="data.gpu" />
    <div v-if="Object.keys(experiment.system).length === 0">
      <p class="text-center pt-5">{{$t('experiment.env.empty.hardware')}}</p>
    </div>
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
import EnvGroups from '../components/EnvGroups.vue'
import { getHardwareData } from '@swanlab-vue/views/experiment/pages/environment/components/parser.js'
import NvidiaGpu from '@swanlab-vue/views/experiment/pages/environment/components/gpu/NvidiaGpu.vue'
const { experiment } = useExperimentStore()

// 系统硬件信息(除 gpu 相关)
const data = computed(() => getHardwareData(experiment))
</script>

<style lang="scss" scoped></style>

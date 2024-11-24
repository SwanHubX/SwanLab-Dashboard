<template>
  <div class="w-full border p-6 rounded-lg bg-default">
    <h1 class="w-full text-xl font-semibold pb-4 border-b">{{ $t('experiment.env.title.overview') }}</h1>
    <EnvGroup :title="$t('experiment.env.groups.experiment')" :data="data.experiment" v-if="data.experiment" />
    <EnvGroup :title="$t('experiment.env.groups.system')" :data="data.system" v-if="data.system" />
    <EnvGroup :title="$t('experiment.env.groups.python')" :data="data.python" v-if="data.python" />
    <EnvGroup :title="$t('experiment.env.groups.git')" :data="data.git" v-if="data.git" />
  </div>
</template>

<script setup>
import { useExperimentStore, useProjectStore } from '@swanlab-vue/store'
import { computed } from 'vue'
import EnvGroup from '../components/EnvGroup.vue'
import { getOverviewData } from '@swanlab-vue/views/experiment/pages/environment/components/parser.js'
const { experiment } = useExperimentStore()
const projectStore = useProjectStore()
const data = computed(() => getOverviewData(experiment, projectStore))
</script>

<style lang="scss" scoped></style>

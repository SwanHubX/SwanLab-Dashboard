<template>
  <div class="w-full py-5 flex-col space-y-5">
    <h1 class="flex items-center gap-2 font-semibold">{{ $t(`experiment.env.groups.${type}`) }}</h1>
    <EnvItem env-key="gpu_driver" :env-value="data.driver" />
    <EnvItem env-key="cuda" :env-value="data.cuda" />
    <EnvItem env-key="gpu_cores" :env-value="data.cores" />
    <div class="w-full flex" v-for="(mem, i) in data.memory" :key="i">
      <span class="text-dimmer w-44 shrink-0">GPU{{ i }}</span>
      <span class="max-w-96 w-full break-words whitespace-wrap shrink">{{ data.type?.[i] }}</span>
      <span class="shrink-0 pl-8">{{ mem }} GB</span>
    </div>
  </div>
</template>

<script setup>
import EnvItem from '@swanlab-vue/views/experiment/pages/environment/components/EnvItem.vue'
defineProps({
  data: {
    type: {
      driver: String,
      cuda: String,
      cores: Number,
      memory: Array,
      type: Array
    },
    default: () => ({})
  },
  type: {
    type: String,
    default: 'gpu'
  }
})
</script>

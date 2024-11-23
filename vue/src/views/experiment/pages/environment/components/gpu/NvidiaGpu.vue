<template>
  <EnvGroups :title="$t(`experiment.env.groups.${type}`)">
    <EnvItem env-key="gpu_driver" :env-value="data.driver" />
    <EnvItem env-key="cuda" :env-value="data.cuda" />
    <EnvItem env-key="gpu_cores" :env-value="data.cores" />
    <div class="w-full flex" v-for="(mem, i) in data.memory" :key="i">
      <span class="text-dimmer w-44 shrink-0">GPU{{ i }}</span>
      <span class="max-w-96 w-full break-words whitespace-wrap shrink">{{ data.type?.[i] }}</span>
      <span class="shrink-0 pl-8">{{ mem }} GB</span>
    </div>
  </EnvGroups>
</template>

<script setup>
import EnvItem from '@swanlab-vue/views/experiment/pages/environment/components/EnvItem.vue'
import EnvGroups from '@swanlab-vue/views/experiment/pages/environment/components/EnvGroups.vue'
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
    default: 'default'
  }
})
</script>

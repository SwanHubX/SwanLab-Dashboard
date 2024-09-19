<template>
  <div class="w-full h-full bg-dimmest text-dimmest flex justify-between items-center px-6">
    <!-- logo and version -->
    <div class="flex items-center gap-1.5 hover:cursor-pointer" @click="$router.push('/')">
      <!-- icon -->
      <HeaderIcon />
      <!-- version -->
      <div class="flex items-end">
        <span class="font-semibold mr-0.5">SwanLab</span>
        <!-- 版本号被注释了 -->
        <!-- <span class="whitespace-nowrap text-xs pl-2 text-dimmer"> {{ formatVersion(version) }}</span> -->
      </div>
    </div>
    <div class="w-full grow flex justify-end gap-6 px-8">
      <!-- button: language switch -->
      <div class="flex items-center font-semibold">
        <button @click="switchLang()" class="switchLang relative w-9 h-9">
          <div :class="mainLangClass">中</div>
          <div :class="secondLangClass">En</div>
        </button>
      </div>
      <!-- links -->
      <div class="px-6 items-center font-semibold gap-8 md:flex hidden">
        <a
          :href="item.link"
          target="_blank"
          class="w-16 hover:text-white-higher text-center"
          v-for="item in links"
          :key="item.link"
        >
          {{ item.title }}
        </a>
      </div>
    </div>
    <!-- fixeds -->
    <div class="flex items-center font-semibold">
      <a
        :href="item.link"
        target="_blank"
        class="flex gap-1.5 items-center h-full text-dimmest hover:text-white-higher"
        v-for="item in fixeds"
        :key="item.icon"
      >
        <SLIcon :icon="item.icon" class="h-8 w-8" />
        <!-- {{ item.title }} -->
      </a>
    </div>
  </div>
</template>

<script setup>
/**
 * @description: 顶部页头
 * @file: PageHeader.vue
 * @since: 2024-01-09 11:13:20
 **/

import { ref } from 'vue'
import HeaderIcon from './HeaderIcon.vue'
import SLIcon from '@swanlab-vue/components/SLIcon.vue'
import { getDefaultLang } from '@swanlab-vue/i18n'
import { useI18n } from 'vue-i18n'
import { t } from '@swanlab-vue/i18n'

defineProps({
  version: {
    type: String,
    default: 'unknown'
  }
})

// ---------------------------------- 格式化版本号 ----------------------------------
// const formatVersion = (version) => {
//   if (version === 'unknown') return version
//   return 'v' + version
// }

// ---------------------------------- 链接配置 ----------------------------------

// *静态数据 国际化需要放到computed中，切换时才会有响应式
const links = computed(() => [
  {
    title: t('nav.docs'),
    link: 'https://docs.swanlab.cn/zh/guide_cloud/general/what-is-swanlab.html'
  },
  {
    title: t('nav.examples'),
    link: 'https://docs.swanlab.cn/zh/examples/mnist.html'
  },
  {
    title: t('nav.feedback'),
    link: 'https://github.com/SwanHubX/SwanLab/issues'
  }
])

const fixeds = ref([
  {
    title: 'GitHub',
    icon: 'github',
    link: 'https://github.com/SwanHubX/SwanLab'
  }
])

// ---------------------------------- 切换语言 ----------------------------------
const nowLangKey = ref(getDefaultLang())
const { locale } = useI18n()

const [mainLangInit, secondLangInit] =
  locale.value === 'zh-CN' ? ['mainlang', 'secondlang'] : ['secondlang', 'mainlang']
const mainLangClass = ref(mainLangInit)
const secondLangClass = ref(secondLangInit)

const switchLang = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  const lang = locale.value
  document.documentElement.lang = lang.toLowerCase()
  localStorage.setItem('lang', lang)

  //图标样式切换
  const temp = mainLangClass.value
  mainLangClass.value = secondLangClass.value
  secondLangClass.value = temp
}
</script>

<style lang="scss" scoped>
.a-hover {
  &:hover {
    @apply text-white-higher;
  }
}

.switchLang:hover .mainlang {
  @apply bg-white-higher;
}

.switchLang:hover .secondlang {
  @apply border-white-higher text-white-higher;
}

.mainlang {
  @apply absolute top-0 left-0 w-6 h-6 z-[1] rounded bg-white-highest text-default text-sm content-center duration-100 ease-in-out;
}

.secondlang {
  @apply absolute left-3 top-3 w-6 h-6 z-[0] rounded border-[1px] border-white-highest text-dimmest text-sm content-center duration-100 ease-in-out;
}
</style>

import { watch } from 'vue'
import { debounce } from '@swanlab-vue/board/utils'
export default class Poller {
  constructor() {
    /**
     * idle: 空闲状态
     * busy: 轮询回调正在执行
     * waiting: 等待下一次轮询
     * @type {'idle' | 'busy' | 'waiting'} 轮询器状态
     */
    this.state = 'idle'
    this.p = null
  }
  /**
   * 启动轮询，在启动之前首先会运行一遍任务
   * @param {ComputedRef<number>} interval 轮询间隔，如果为0则不轮询
   * @param {Function} task 轮询执行函数，异步
   */
  async start(interval, task) {
    await task()
    if (!interval.value) return
    this.state = 'waiting'
    clearInterval(this.p)
    this.p = setInterval(async () => {
      if (this.state !== 'waiting') return
      this.state = 'busy'
      await (async () => {
        try {
          await task()
        } catch (e) {
          console.error(e)
        }
      })()
      this.state = 'waiting'
    }, interval.value)
    watch(interval, (v) => {
      if (!v) this.stop()
    })
  }

  /**
   * 轮询停止函数
   */
  stop = debounce(() => {
    this.state = 'idle'
    clearInterval(this.p)
  })
}

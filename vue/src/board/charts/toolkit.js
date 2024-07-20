import { inject } from 'vue'

/** 媒体信息获取器 */
export class MediaGetter {
  constructor() {
    /** @type {import("../ChartsBoard.vue").getMediaMetricsRequest} */
    this.getMediaMetrics = inject('GetMediaMetrics')
    /** @type {import("../ChartsBoard.vue").getMediaResourceRequest} */
    this.getMediaResource = inject('GetMediaResource')
  }
  /**
   * 获取媒体资源请求函数
   * @type {import("../ChartsBoard.vue").getMediaMetricsRequest}
   * */
  metrics = this.getMediaMetrics

  /**
   * 获取媒体信息请求函数
   * @type {import("../ChartsBoard.vue").getMediaResourceRequest}
   * */
  resource = this.getMediaResource
}

/** 创建渲染函数 */
export const createRender = () => {}

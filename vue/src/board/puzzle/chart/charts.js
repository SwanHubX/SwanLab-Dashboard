import C from '@swanlab-vue/board/charts'
import T from '@swanlab-vue/board/toolbar'

export default {
  audio: {
    chart: C.audio,
    toolbar: T.chart
  },
  empty: {
    chart: C.empty,
    toolbar: T.empty
  },
  error: {
    chart: C.error,
    toolbar: T.chart
  },
  image: {
    chart: C.image,
    toolbar: T.chart
  },
  line: {
    chart: C.line,
    toolbar: T.line
  },
  text: {
    chart: C.text,
    toolbar: T.chart
  }
}

import AudioChart from './audio/AudioChart.vue'
import LineChart from './line/LineChart.vue'
import ImageChart from './image/ImageChart.vue'
import TextChart from './text/TextChart.vue'
import EmptyChart from './empty/EmptyChart.vue'

export default {
  line: LineChart,
  audio: AudioChart,
  image: ImageChart,
  text: TextChart,
  error: TextChart,
  empty: EmptyChart
}

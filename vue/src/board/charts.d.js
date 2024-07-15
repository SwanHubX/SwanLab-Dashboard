/**
 * @typedef {String} IndexId 在board范围下，唯一id，在前端作为数据查找标识
 */

/**
 * 图表分组
 * @typedef {Object} Section
 * @property {'PUBLIC' | 'PINNED' | 'HIDDEN'} type 分组类型
 * @property {IndexId} index 分组 ID，唯一识别的 {@link IndexId}
 * @property {String} name 分组名
 * @property {Boolean} folded 是否折叠
 * @property {Object} [config] 分组配置
 * @property {7 | 6 | 4 | 3 | 2 | 1} cols 分组内部图表列数（一行最多显示几个图表）
 * @property { Number } rowHeight 分组内部图表行高
 * @property {IndexId[]} chartIndex 分组内的图表 ID 列表，用于排序，每个元素为唯一识别的图表 {@link IndexId}
 */

/**
 * 图表
 * @typedef {Object} Chart
 * @property {IndexId} index 图表 ID
 * @property {String} title 图表名
 * @property {'#528d59'} color 图表默认颜色
 * @property {Object} [config] 图表配置
 * @property {'LINE' | 'TEXT' | 'IMAGE' | 'AUDIO'} type 图表类型，分配为不同的组件
 * @property {Metric[]} metrics 此图表包含的指标列表
 */

/**
 * 图表指标配置，需要通过 {@link Column.key} 判断两个指标是否为同一指标，但是即使是同一指标，在不同图表下，配置信息也有可能不同
 * @typedef {Object} Metric
 * @property {'X' | 'Y'} axis 指标所在轴
 * @property {String} name 图表中展示的指标名，用于前端显示的指标名称 - 默认情况下，单实验下为指标key，多实验下为实验名
 * @property {IndexId} expId 指标对应的实验 ID，是唯一识别的 {@link IndexId}
 * @property {[String, String]} colors 指标颜色，用于前端展示，长度为2，第一个为白天模式，第二个为夜间模式
 * @property {Column} column 列数据，指标实际存储指向
 */

/**
 * 指标列数据
 * @typedef {Object} Column
 * @property {'SYSTEM' | 'CUSTOM'} class 类型 - [SYSTEM, CUSTOM]
 * @property {String} [error] 错误信息, 字符串
 * @property {IndexId} key 列的id，每个列通过此属性进行识别，此属性为 列 的唯一识别 {@link IndexId}
 * @property {String} name tag 名称，一般和 key 相同
 * @property {'LINE' | 'TEXT' | 'IMAGE' | 'AUDIO'} type tag 类型 - [LINE, TEXT, IMAGE, AUDIO]
 */

/**
 * 指标数据超集
 * @typedef {Object} MetricData
 * @property {IndexId} experimentId 实验 ID，是唯一识别的 {@link IndexId}
 * @property {IndexId} key 检索的指标名，是唯一识别的 {@link IndexId}
 * @property {any[]} metrics 指标数据列表
 */

/**
 * 指标数据存储对象
 * @typedef {MetricData & {metrics: ScalarDetail[]}} ScalarData
 */

/**
 * 针对单个指标进行管理
 * @typedef {Object} ScalarDetail
 * @property {Number} index 步数
 * @property {Number} data 指标数据
 * @property {true} [_last] 是否为最后一条数据，最后一个数据设置为true即可，其他不需要设置
 */

/**
 * 指标数据存储对象
 * @typedef {MetricData & {metrics: MediaDetail[], steps: Number[]}} MediaData
 */

/**
 * 媒体更多信息存储超集
 * @typedef {Object} MediaMoreDetail
 * @property {String} caption 媒体描述
 */

/**
 * 针对对于单个指标的详细数据存储结构
 * @typedef {Object} MediaDetail
 * @property {Number} index 步数
 * @property {String[]} data 指标数据
 * @property {Array<MediaMoreDetail|null>} [more] 指标数据的更多信息
 */

// ---------------------------------- 折线图数据结构 ----------------------------------

/**
 * 折线图图表配置
 * @typedef { Chart & {type: 'LINE'} } LineChart
 */

/**
 * 折线图数据
 * @typedef {ScalarData} LineMetricData
 */

// ---------------------------------- 图像数据结构 ----------------------------------

/**
 * 图像图表配置
 * @typedef {Chart & {type: 'IMAGE'} } ImageChart
 */

/**
 * 图像数据
 * @typedef {MediaData} ImageMetricData
 */

// ---------------------------------- 音频数据结构 ----------------------------------

/**
 * 音频图表配置
 * @typedef {Chart & {type: 'AUDIO'} } AudioChart
 */

/**
 * 音频数据
 * @typedef {MediaData} AudioMetricData
 */

// ---------------------------------- 文字图数据结构 ----------------------------------

/**
 * 文字图表配置
 * @typedef {Chart & {type: 'TEXT'} } TextChart
 */

/**
 * 文字数据
 * @typedef {MediaData} TextMetricData
 */

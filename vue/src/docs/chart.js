/**
 * @typedef {IndexId} ExperimentId 实验id
 */

/**
 * @typedef {IndexId} ColumnKey 指标列的名称
 */

/**
 * @typedef {Object} Section 图表分组
 * @property {'PUBLIC' | 'PINNED' | 'HIDDEN'} type 分组类型 - [PUBLIC, PINNED, HIDDEN]
 * @property {IndexId} index 分组 ID
 * @property {String} name 分组名
 * @property {Boolean} pinned 是否固定
 * @property {Boolean} folded 是否折叠
 * @property {Object} config 分组配置
 * @property {IndexId[]} chartIndex 分组内的图表 ID 列表，用于排序
 */

/**
 * @typedef {Object} Chart 图表
 * @property {IndexId} index 图表 ID
 * @property {String} title 图表名
 * @property {Object} config 图表配置
 * @property {'LINE' | 'TEXT' | 'IMAGE' | 'AUDIO'} type 图表类型 - [LINE, TEXT, IMAGE, AUDIO]
 * @property {Metric[]} metrics 指标 ID 列表，对应 tag 名
 */

/**
 * @typedef {Object} Metric 图表指标配置
 * @property {'X' | 'Y'} axis 指标轴 - [X, Y]
 * @property {String} name 图表中展示的指标名，用于前端显示的指标名称 - 默认情况下，单实验下为指标key，多实验下为实验名
 * @property {ExperimentId} expId 指标对应的实验 ID
 * @property {String[]} colors 指标颜色，用于前端展示，长度为2，第一个为白天模式，第二个为夜间模式
 * @property {Column} column 列数据，指标实际存储指向
 */

/**
 * @typedef {Object} Column 指标列数据
 * @property {'SYSTEM' | 'CUSTOM'} class 类型 - [SYSTEM, CUSTOM]
 * @property {String | null} error 错误信息, 字符串
 * @property {ColumnKey} key tag key，在项目下唯一，同一个 key 可以出现在多个实验中
 * @property {String} name tag 名称，一般和 key 相同
 * @property {'LINE' | 'TEXT' | 'IMAGE' | 'AUDIO'} type tag 类型 - [LINE, TEXT, IMAGE, AUDIO]
 */

/**
 * 指标数据存储对象
 * @typedef {Object} ScalarData
 * @property {ExperimentId} experimentId 实验 ID
 * @property {ColumnKey} key 检索的指标名
 * @property {ScalarDetail[]} metrics 指标数据列表
 */

/**
 * 针对单个指标进行管理
 * @typedef {Object} ScalarDetail
 * @property {Number} index 步数
 * @property {Number} data 指标数据
 * @property {undefined | true} _last 是否为最后一条数据，最后一个数据设置为true即可，其他不需要设置
 */

/**
 * 指标数据存储对象
 * @typedef {Object} MediaData
 * @property {ExperimentId} experimentId 实验 ID
 * @property {ColumnKey} key 指标名
 * @property {Number[]} steps 步数列表，代表这个指标在哪些步数下有数据
 * @property {MediaDetail} metric 最后一步的指标数据
 */

/**
 * 针对单个指标进行管理
 * @typedef {Object} MediaDetail
 * @property {Number} index 步数
 * @property {String[]} data 指标数据
 * @property {Object[] | String[] | undefined} more 指标数据的更多信息，不同类型的数据结构不同，具体结构由图表决定
 */

/**
 * @typedef {Object<ExperimentId, ScalarData | MediaData>} DataStore 单个指标在不同实验下的数据存储
 */

/**
 * @typedef {Object<ColumnKey, DataStore>} MetricStore 指标信息存储对象
 */

// ---------------------------------- 本地版后端的原始数据结构 ----------------------------------

/**
 * @typedef { Object } OriginalData
 * @property { Namespace[] } namespaces 命名空间
 * @property { OriginalChart[] } charts 图表
 */

/**
 * @typedef { Object } Namespace
 * @property { Number } id 命名空间ID，-1表示置顶，-2表示隐藏
 * @property { String } name 命名空间名称
 * @property { String } description 命名空间描述
 * @property { Number } sort 排序
 * @property { Object | null } more 更多信息
 * @property { Object | null } experiment_id 所属实验信息(多实验图表时为 null)
 * @property { Object | null } project_id 所属项目信息(单实验图表时为 null)
 * @property { Array<Number> } charts 图表ID数组
 * @property { Number } opened 0表示收起，1表示展开
 * @property { String } created_time 创建时间
 * @property { String } updated_time 更新时间
 */

/**
 * @typedef { Object } OriginalChart
 * @property { Number } id 图表ID
 * @property { 'default' | 'line' | 'image' | 'audio' | 'text' } type 图表类型
 * @property { String } name 图表名称
 * @property { String } description 图表描述
 * @property { Boolean } multi 是否是多实验图表
 * @property { String } reference 实验进度参考
 * @property { Array<String> } source 图表数据来源列表，当前为实验名
 * @property { Object<String, Number> } source_map 图表数据来源映射，当前为实验ID
 * @property { Object | null } experiment_id 所属实验信息(多实验图表时为 null)
 * @property { Object | null } project_id 所属项目信息(单实验图表时为 null)
 * @property { String } created_time 创建时间
 * @property { String } updated_time 更新时间
 */

// 前端图表部分以数组排序，每个元素为一个group即section
// section数组下标代表排序，下标越小排序越靠前
// section内有charts字段，为数组，内包含一个个charts对象
// 开源版对象类型以Open为前缀

/**
 * @typedef {Object} OpenSection 一个节容器，存放图表，和一些默认情况
 * @property {number | string} id 平常不会使用，用于区别pin的section（-1）和hidden的section（-2），不影响排序，只影响名称显示；另一方面，将使用这个作为v-for时的key
 * @property {string} name section的名称，特别的，如果为default或者id为-1、-2，则按照前端定义的名称显示
 * @property {boolean | number} opened section是否展开，默认为true或者1
 * @property {OpenChart[]} charts 这个section内包含的图表
 */

/**
 * @typedef {Object} OpenChart 一个图表配置，用于标注这个图表是什么类型以及配置是什么，使用了什么数据源
 * @property {number | string} id 图表唯一id，用于v-for时的key
 * @property {boolean} multi 标注是否为多实验图表显示，这涉及到图表组件内部不同的数据处理方式
 * @property {string} name 图表名称
 * @property {string} reference 参考系，目前默认为step
 * @property {string[]} source 数据源列表，这里是显示在图表上的数据名称
 * @property {Object} source_map 数据源映射，用于前端显示数据源的名称映射到数据源对应的实验id
 * @property {Object} error 当前图表是否错误，如果不为null说明图表错误，此信息用于显示错误
 * @property {string} error.data_class sdk中上传时的数据类型，用于前端提示
 */

/**
 * @typedef {Object} OpenMetricData 一个指标包含的数据
 * @property {string | number} experiment_id 实验id
 * @property {OpenMetricDetail[]} list 数据列表
 */

/**
 * @typedef {Object} OpenMetricDetail 一个指标包含的数据
 * @property {number} index 指标步数
 * @property {number | string | string[]} data 这一步的数据
 * @property {boolean} _last 是否为最后一条数据，最后一个数据设置为true即可，其他不需要设置
 */

/**
 * @typedef {Object<string, OpenMetricData>} OpenChartData 传递给图表的数据
 */

/**
 * @callback OpenChartSubscribe 图表本身向父组件传递数据的订阅函数
 * @param {string[]} sources 数据源名称，代表这个图表使用了哪些数据源
 * @param {string} chartId 图表id
 * @param {OpenChartSubscribeCallback} callback 订阅成功后的回调函数
 */

/**
 * @callback OpenChartSubscribeCallback 图表本身向父组件传递数据的 订阅成功/数据更改 的回调函数，父组件将在订阅成功后调用这个函数
 * @param {string} key 数据源名称
 * @param {string} data 数据源的数据
 * @param {Object} error 请求失败的错误信息——如果有的话，没有就是null
 */

// ---------------------------------- 图表api ----------------------------------

/**
 * @callback setOriginalChartHeight 设置图表的原始高度，如果在执行前图表还没有被渲染，那么将在图表渲染后立即执行
 * @param {number} height 图表的高度, 单位px
 * @param {number} [maxHeight=800] 图表的最大高度, 单位px, 默认为800
 * @param {number} [minHeight=200] 图表的最小高度, 单位px, 默认为200
 */

// ---------------------------------- new chart model ----------------------------------

/**
 * @typedef {String} ExperimentId 实验id
 */

/**
 * @typedef {String} ColumnKey 指标列的名称
 */

/**
 * @typedef {Object} Section 图表分组
 * @property {PUBLIC | PINNED | HIDDEN} type 分组类型 - [PUBLIC, PINNED, HIDDEN]
 * @property {String} index 分组 ID
 * @property {String} name 分组名
 * @property {Boolean} pinned 是否固定
 * @property {Boolean} folded 是否折叠
 * @property {Object} config 分组配置
 * @property {String[]} chartIndex 分组内的图表 ID 列表，用于排序
 */

/**
 * @typedef {Object} Chart 图表
 * @property {String} index 图表 ID
 * @property {String} title 图表名
 * @property {Object} config 图表配置
 * @property {LINE | TEXT | IMAGE | AUDIO} type 图表类型 - [LINE, TEXT, IMAGE, AUDIO]
 * @property {String} size 图表尺寸
 * @property {Metric[]} metrics 指标 ID 列表，对应 tag 名
 */

/**
 * @typedef {Object} Metric 图表指标配置
 * @property {'X' | 'Y'} axis 指标轴 - [X, Y]
 * @property {String} name 图表中展示的指标名，用于前端显示的指标名称 - 默认情况下，单实验下为指标key，多实验下为实验名
 * @property {String} expId 指标对应的实验 ID
 * @property {String[]} colors 指标颜色，用于前端展示，长度为2，第一个为白天模式，第二个为夜间模式
 * @property {Column} column 列数据，指标实际存储指向
 */

/**
 * @typedef {Object} Column 指标列数据
 * @property {String} class 类型 - [SYSTEM, CUSTOM]
 * @property {String | null} error 错误信息, 字符串
 * @property {ColumnKey} key tag key，在项目下唯一，同一个 key 可以出现在多个实验中
 * @property {String} name tag 名称，一般和 key 相同
 * @property {String} type tag 类型 - [LINE, TEXT, IMAGE, AUDIO]
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

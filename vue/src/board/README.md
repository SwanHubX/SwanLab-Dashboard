# Chart Dashboard

作为swanlab的核心图表组件，我们将其开源，并且会复用到线上版本的图表组件中——在此记录一些设计思路和实现细节。
所有设计基于以下条件：

1. 图表以 `section` `chart` `metric` `column` 几种数据结构完成组织；
2. `section`和`chart` 以 `index`作为唯一标识；
3. `metric` 作为column的包装，与column是多对一的关系，前端并不关心其唯一性，只需要用到里面的标识数据；
4. `column` 的key在同一实验下唯一，但可以被其他实验（比如多实验图表，就是一个特殊的实验）复用，因此通过key和实验id来唯一标识；

> 具体的数据结构可参考 [charts.d.js](./charts.d.js)，里面详细描述了数据结构和字段的含义。

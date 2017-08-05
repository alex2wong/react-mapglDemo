## React-MapGL Project

Try to build some demos for my wedding invitation, demonstrating routes to my ceremony and hotel, picture places and big events location. Project mainly depend on react, [react-map-gl](https://github.com/uber/react-map-gl)

## build some components

During the process, some usefull modules or components would be dev for react-map-gl.

### 事件地图
打算用 Mapbox-gl 开发一款交互式的事件地图，带时间轴.
基于es6，webpack 模块化编写时间轴 和 轨迹动画等几个模块

### ReactMapGL
经过一两天的试用，觉得react map-gl 这种正在开发中的开源库还是有点意思的。
每天可以看到很多issue 和 pull request，可以看到其对webgl、移动端touch 的支持。

#### 正在做的
- 在react子组件中调用root组件中对map viewport的记录和回访(Done)
- 这个插件可用于viewport回访，加上mapbox-gl 的动画可以达到较好的展示效果

- 关于参加wedding ceremony的宾客来源动画展示，利用map-gl的canvasOverlay叠加层渲染，
- 需要用到2dContext的一些配置，shadowColor，shadowBlur等, 达到轨迹点发光的效果 (Done)
DEMO screenshot: <br>
![DEMO screenshot:](https://raw.githubusercontent.com/alex2wong/react-mapglDemo/master/assets/demoScreen.gif.gif)

#### 准备做的
- 时间轴和 viewport 的联动，点击事件，地图反馈；点击地图，弹出popup详情.(Inprogress)
- 将婚礼当天的主要事件列表为时间轴，并可展开详情
- 分析TweenJS，重写一个简单版本的Tween，已经完成[DEMO](https://alex2wong.github.io/react-mapglDemo/examples/tween/) (Done)

### 拆分重构根组件
目前App 组件中包含过多职能：
- 需要将叠加层的canvas 通用函数提出为单独module，与具体数据解耦，参考Utils.js (Done)
- 尽量简化App 根组件的职能，只作为各子组件的载体.(Inprogress: viewport回放功能还未拆分)

#### 重构思考
作为通用的canvas 渲染函数，如果没有存储私有数据的要求，完全可以采用接受参数的写法，不用写成Class而担心作用域变动的问题.

- 尽量简化渲染函数的结构
- 对于requestAnimationFrame, setInterval 等异步注册函数，采用注册回调函数时重定向this的策略. 对于多图层对象的动画控制，采用类似TweenJS 这样的库来操作

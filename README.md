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
- 在react子组件中调用root组件中对map viewport的记录和回访
- 这个插件可用于viewport回访，加上mapbox-gl 的动画可以达到较好的展示效果

DEMO screenshot:
![DEMO screenshot:](https://raw.githubusercontent.com/alex2wong/react-mapglDemo/master/assets/demoScreen.gif.gif)

#### 准备做的
- 时间轴和 viewport 的联动

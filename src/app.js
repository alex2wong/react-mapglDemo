/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {StaticMap ,NavigationControl, CanvasOverlay} from 'react-map-gl';

import ControlPanel from './control-panel';
import Timeline from './timeline';

import {defaultMapStyle, rasterStyle, pointLayer, polyLayer} from './map-style.js';
import {pointOnCircle, parseGaode} from './utils';

import routes from '../assets/chongq2nanxi_coords.json';
import {fromJS} from 'immutable';
import {json as requestJson}  from 'd3-request';

const token = process.env.MapboxAccessToken; // eslint-disable-line
// const token = 'pk.eyJ1IjoiaHVhbmd5aXhpdSIsImEiOiI2WjVWR1hFIn0.1P90Q-tkbHS38BvnrhTI6w';

if (!token) {
  throw new Error('Please specify a valid mapbox token');
}

const darkStyle = "mapbox://styles/mapbox/dark-v9";

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
}

const shanghai = {
  longitude: 120.4114,
  latitude: 30.777
}

const yibin = {
  longitude: 104.973206,
  latitude: 28.837425
}

const beijing = {
  longitude: 116.379559,
  latitude: 39.896465,
}

const panshi = {
  longitude: 126.077091,
  latitude: 42.942959
}

const eventTable = {
  1: {
    eventName: 'Fetch Bride',
    time: '8:30 am',
    location: {
      longitude: 104.973206,
      latitude: 28.837425
    },
    place: 'hotel',
  },
  2: {
    eventName: 'Wedding ceremony',
    time: '12:08 am',
    location: {
      longitude: 104.973206,
      latitude: 28.837425
    },
    place: 'hotel',
  },
  3: {
    eventName: 'Taking Photo',
    time: '15:30 am',
    location: {
      longitude: 104.970206,
      latitude: 28.835425
    },
    place: 'riverside',
  },
}

const coords = parseGaode(routes, 'lonlat');
const rasterStyle2 = Object.assign(defaultMapStyle, rasterStyle);

// React Component named App...
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapStyle: rasterStyle2,
      history_view: [],
      viewIndex: 0,
      viewport: {
        latitude: yibin.latitude,
        longitude: yibin.longitude,
        zoom: 9,
        bearing: 20,
        pitch: 40,
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  // register window resize event.. component lifecycle start.
  componentDidMount() {
    var that = this;
    // when registering ,store App Component in `that`, which in a closure.
    window.addEventListener('resize', function(){
      that._resize.call(that);
    });
    this._resize();
    requestJson('https://alex2wong.github.io/react-mapglDemo/assets/feature-example-sf.json', 
    (error, response) => {
      if (!error) {
        this._updatePointData(response);
      }
    });
  }

  componentWillUnmount() {
    let that = this;
    window.removeEventListener('resize', function(){
      that._resize.call(that);
    });
  }

  // set Component state when resize..
  _resize() {
    // let oldVP = {};    
    this.setState({
      viewport: Object.assign({},this.state.viewport, {
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      })
    });
  }

   _animatePoint() {
    var that = this;
    this._updatePointData(pointOnCircle({center: [yibin.longitude, yibin.latitude], angle: Date.now() / 1000, radius: 20}));
    window.requestAnimationFrame(function(){
      that._animatePoint.call(that);
    });
  }

  // private methods for App.
  _updatePointData(polygons) {
    let {mapStyle} = this.state;
    if (!mapStyle.hasIn(['source', 'polyLayer'])) {
      mapStyle = mapStyle
        // Add geojson source to map
        .setIn(['sources', 'polyLayer'], fromJS({type: 'geojson'}))
        // Add point layer to map
        .set('layers', mapStyle.get('layers').push(polyLayer));
    }
    // Update data source
    console.log("### geojson polygons added to map source..");
    mapStyle = mapStyle.setIn(['sources', 'polyLayer', 'data'], polygons);
    // mapStyle = mapStyle.setIn(['sources', 'stamen', 'tiles'])
    this.setState({mapStyle});
  }


  // update Map Component according to input viewport..
  _updateViewport(viewport) {
    this.setState({viewport});
  }

  changed(v) {
    console.warn("viewport changed..centerLong: " + v.longitude);
    // No use ??
    this.setState(
        Object.assign({}, this.state.viewport, {
            longitude: this.state.viewport.longitude + 0.1,
            pitch: this.state.viewport.pitch + 10,})
        )
  }

  // try to record and navi history viewport..  `this` refer to Object who triggered it..
  navi(v) {
    // TODO.. apply strategy to reduce codes..
    if (v == 0 && this.state.history_view.length > 0 && this.state.viewIndex > 0) {
      this.state.viewIndex -= 1;
      this.setState({
        viewport: Object.assign({}, this.state.history_view[this.state.viewIndex])
      });
      console.warn("called parent preView func");
    } else if (v == 1 && this.state.history_view.length - 1 > this.state.viewIndex ) {
      this.state.viewIndex += 1;
      this.setState({
        viewport: Object.assign({}, this.state.history_view[this.state.viewIndex])
      });
      console.warn("called parent nexView func");
    } else if (v != 0 && v!= 1){
      this.add2hist(this.state.history_view, this.state.viewport);
    }

  }

  add2hist(histViews, curView) {
    let isChanged = this.isViewChanged(histViews, curView);
    if (isChanged) {
      histViews.push(curView);
      // move cursor to recent viewport instance
      this.state.viewIndex = histViews.length - 1;
      console.log("history_view recorded.."+ histViews.length);
    }
  }

  isViewChanged(histViews, curView) {
    if (histViews.length > 0) {
      let lastView = histViews.length - 1;
      return (this.state.viewport != this.state.history_view[lastView] 
        && !this.ExistedinViews(histViews, curView));      
    } else return true;
  }

  ExistedinViews(histViews, curView) {
    for(var i = 0; i < histViews.length; i++) {
      if (curView == histViews[i]) return true;
    }
  }

  goPolyLayer(viewport, evt) {
    const newView = Object.assign(viewport, {longitude: -122.4, latitude: 37.8});
    this.setState({newView});
    console.warn("viewport changed to USA_SF...");
    console.warn("click evt: " + evt);
    evt.stopPropagation();
    evt.preventDefault();
  }

  // event/timeline table..
  fly2Event(type) {
    // fly2 different viewport and display detail..
  }

  // setState({newView}) to navi viewport to event position.
  fly2position(viewport, item) {
    console.log("event position for event " + item);
  }

  // update parent component by passing func to sub component.
  render() {
    // viewport obj is ref to Root.state;
    const {viewport} = this.state;
    const canvView = Object.assign({}, viewport, {isDragging:false,redraw:overlayerDraw, locations:coords.coordinates});
    const eventView = Object.assign({}, viewport, {isDragging:false,redraw:circleDraw});
    return (
      <MapGL
        {...viewport}
        mapStyle={this.state.mapStyle}
        onViewportChange={v => this.setState({viewport: v})}
        onMouseUp={e => this.navi(e)}
        preventStyleDiffing={false}
        mapboxApiAccessToken={token} >

        {/*{isDragging:false,redraw:()=>{console.log("ctx:" + ctx)}}*/}
        <CanvasOverlay 
          {...canvView}
        dotRadius={4} 
        globalOpacity={1} 
        compositeOperation="screen"
        dotFill="#1FBAD6"
         />

         <CanvasOverlay 
          {...eventView}
        globalOpacity={0.95} 
         />

        <Timeline class="timeline" handleItem={(item)=>{this.fly2position(this.state.viewport,item)}}/>

        <ControlPanel className="hisView" onClick={(e)=>this.test(e)} pFunc={(v) => {this.navi(v)}}
          goPolyLayer={(evt) => this.goPolyLayer(this.state.viewport, evt)}
          />

        <div className="nav" style={navStyle} onClick={e => {this.navi(e)}} >
          <NavigationControl onViewportChange={v=>this.setState({viewport: v})} 
             />
          </div>
      </MapGL>
    );
  }

}

var radius = 10, animateTimer = null, pathIndex = 0;
function preSetCtx(context) {
  //默认值为source-over
    var prev = context.globalCompositeOperation;
    //只显示canvas上原图像的重叠部分
    context.globalCompositeOperation = 'destination-in';
    //设置主canvas的绘制透明度
    context.globalAlpha = 0.95;
    //这一步目的是将canvas上的图像变的透明
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    //在原图像上重叠新图像
    context.globalCompositeOperation = prev;
}
function renderCircle(context, point) {
  //画圆
    preSetCtx(context);
    // context.clearRect(0,0,context.canvas.width, context.canvas.height);
    context.beginPath();
    context.arc(point[0], point[1], radius, 0, Math.PI * 2);    
    context.closePath();
    context.lineWidth = 2; //线条宽度
    context.strokeStyle = 'rgba(250,250,50, 0.9)'; //颜色
    context.stroke();

    radius += 0.5; //每一帧半径增加0.5
    //半径radius大于30时，重置为0
    if (radius > 20) {
        radius = 5;
    }
}

function renderPath(context, point) {
  preSetCtx(context);
  context.save();
  context.shadowColor = '#fff';
  context.shadowBlur = 10;
  context.beginPath();
  context.arc(point[0], point[1], 4, 0, Math.PI * 2);
  context.lineWidth = 2; //线条宽度
  context.fillStyle = 'rgba(131, 235, 235, 0.9)';
  context.fill();
  context.closePath();
  context.restore();
}

function circleDraw(props) {
  //  // if viewport changed, clear old interval.
  // clearInterval(animateTimer);  
  // animateTimer = window.setInterval(function(){
  //   renderCircle(props.ctx, props.project([yibin.longitude, yibin.latitude]));
  // }, 40);  
}

function overlayerDraw(props) {
  // purple, 253, 45,215. lightblue 10, 210, 250， yellow: 255,235,59
  props.ctx.strokeStyle = 'rgba(131, 235, 235, 0.6)';
  let canvas = props.ctx.canvas;
  props.ctx.clearRect(0,0,canvas.width, canvas.height);
  // step equal to total points/ total frames number..
  let pathlen = coords.coordinates.length, step = parseInt(pathlen/100), firstPoint = true;
  clearInterval(animateTimer);
  props.ctx.beginPath();
  for(let i=0;i<pathlen;i++) {  
    let coord = coords.coordinates[i];
    // one thing! there is no pitch/bearing project... only wgs84-> web mercator.
    let point = props.project([coord.longitude, coord.latitude]);
    if (firstPoint) {
      props.ctx.moveTo(point[0], point[1]);
      firstPoint = false;
    } else {
      props.ctx.lineTo(point[0], point[1]);
    }    
  }
  props.ctx.stroke();
  animateTimer = window.setInterval(function() {
    renderPath(props.ctx, props.project([
      coords.coordinates[pathIndex].longitude, coords.coordinates[pathIndex].latitude]));
    if (pathIndex < (pathlen-step)) {
      pathIndex += step;
    } else {
      pathIndex = 0;
    }
    renderCircle(props.ctx, props.project([yibin.longitude, yibin.latitude]));
  }, 25);
}

// const root = document.createElement('div');
// document.body.appendChild(root);
const root = document.createElement('div');
document.body.appendChild(root);

render(<App />, root);

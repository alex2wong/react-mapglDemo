/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {StaticMap ,NavigationControl, CanvasOverlay, Marker} from 'react-map-gl';

import ControlPanel from './control-panel';
import Timeline from './timeline';

import {defaultMapStyle, rasterStyle, pointLayer, polyLayer} from './map-style.js';
import {pointOnCircle, parseGaode} from './utils';

import routes from '../assets/chongq2nanxi_coords.json';
import {fromJS} from 'immutable';
import {json as requestJson}  from 'd3-request';
import Curve from './curveLine';
import {PointLayer, PathLayer, drawCircle, renderStaticPath} from './canvasLine';
import {shanghai, yibin, beijing, chengdu, panshi, eventTable} from './data';

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
        bearing: 0,
        pitch: 40,
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  // register window resize event.. component lifecycle start! Only Once!
  componentDidMount() {
    var that = this;
    // when registering ,store App Component in `that`, which in a closure.
    window.addEventListener('resize', function(){
      that._resize.call(that);
    });
    this._resize();
    // // test request remote jsonData
    // requestJson('https://alex2wong.github.io/react-mapglDemo/assets/feature-example-sf.json', 
    // (error, response) => {
    //   if (!error) {
    //     this._updatePointData(response);
    //   }
    // });
  }

// when com lifecycle end.
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
    // hasIn setIn is immutable methods.. return deep copy ones.
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

  // setState({newView}) to navi viewport to event position and display detail..
  fly2position(viewport, item) {
    console.log("event position for event " + item);
  }

  // update parent component by passing func to sub component.
  render() {
    // viewport obj is ref to Root.state;
    const {viewport} = this.state;
    var pathLayer = new PathLayer({});
    var pointLayer = new PointLayer({});
    const canvView = Object.assign({}, viewport, {isDragging:false,redraw:pathLayer.drawPath, coords:coords});
    const eventView = Object.assign({}, viewport, {isDragging:false,redraw:drawCircle});
    const sh2ybLines = Curve.getCurveByPoints(Curve.Point(shanghai.longitude,shanghai.latitude),
      Curve.Point(yibin.longitude, yibin.latitude));
      const sh2ybView = Object.assign({}, viewport, {redraw:renderStaticPath})
      
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
        strokeStyle="rgba(131, 235, 235, 0.8)"
         />

         <CanvasOverlay 
          {...eventView}
        globalOpacity={0.95}
        strokeStyle="rgba(220, 215, 30, 0.75)"
        longitude={yibin.longitude}
        latitude={yibin.latitude}
         />

        <Timeline class="timeline" handleItem={(item)=>{this.fly2position(this.state.viewport,item)}}/>

        <ControlPanel className="hisView" onClick={(e)=>this.test(e)} pFunc={(v) => {this.navi(v)}}
          goPolyLayer={(evt) => this.goPolyLayer(this.state.viewport, evt)}
          />

        <div className="nav" style={navStyle} onClick={e => {this.navi(e)}} >
          <NavigationControl onViewportChange={v=>this.setState({viewport: v})} 
             />
          </div>

          <Marker key={1} longitude={eventTable[3].location.longitude} 
            latitude={eventTable[3].location.latitude}>
              <div className="icon icon-pikaq"></div>
            </Marker>
      </MapGL>
    );
  }
}

function drawPath(props) {
    // setInterval is not recommended !! requestAnimationFrame is better.
    requestAnimationFrame(drawPath)
    (function(){
        // static background path render should not included in requestAnimationFrame.
        pathLayer.drawPath(props);        
    })();
}

// const root = document.createElement('div');
// document.body.appendChild(root);
const root = document.createElement('div');
document.body.appendChild(root);

render(<App />, root);

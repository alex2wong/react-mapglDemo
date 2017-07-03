/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {NavigationControl} from 'react-map-gl';

import ControlPanel from './control-panel';

const token = process.env.MapboxAccessToken; // eslint-disable-line
// const token = 'pk.eyJ1IjoiaHVhbmd5aXhpdSIsImEiOiI2WjVWR1hFIn0.1P90Q-tkbHS38BvnrhTI6w';

if (!token) {
  throw new Error('Please specify a valid mapbox token');
}

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

// React Component named App...
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history_view: [],
      viewIndex: 0,
      viewport: {
        latitude: yibin.latitude,
        longitude: yibin.longitude,
        zoom: 11,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  // register window resize event..
  componentDidMount() {
    var that = this;
    // when registering ,store App Component in `that`, which in a closure.
    window.addEventListener('resize', function(){
      that._resize.call(that);
    });
    this._resize();
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

    // Object.assign(oldVP,this.state.viewport);
    this.setState({
      viewport: {
        // object assign.. destruct?? require props for MapGL
        latitude: this.state.viewport.latitude,
        longitude: this.state.viewport.longitude,
        zoom: this.state.viewport.zoom,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
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

  // update parent component by passing func to sub component.
  render() {
    // viewport obj is ref to Root.state;
    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        onViewportChange={v => this.setState({viewport: v})}
        onMouseUp={e => this.navi(e)}
        preventStyleDiffing={false}
        mapboxApiAccessToken={token} >

        <ControlPanel className="hisView" pFunc={(v) => {this.navi(v)}}/>

        <div className="nav" style={navStyle} onClick={e => {this.navi(e)}} >
          <NavigationControl onViewportChange={v=>this.setState({viewport: v})} 
             />
          </div>
      </MapGL>
    );
  }

}

// const root = document.createElement('div');
// document.body.appendChild(root);
const root = document.createElement('div');
document.body.appendChild(root);

render(<App />, root);

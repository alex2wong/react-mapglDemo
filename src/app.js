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
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
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

  // try to record and navi history viewport..
  navi(v) {
    // TODO
    this.state.history_view.push(v);
    console.log("history_view recorded.."+ this.state.history_view.length);
  }

  render() {
    // viewport obj is ref to Root.state;
    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        onViewportChange={v => this.setState({viewport: v})}
        onMoveEnd={v => this.navi(v)}
        preventStyleDiffing={false}
        mapboxApiAccessToken={token} >

        <ControlPanel />

        <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={v=>this.setState({viewport: v})} 
             onclick={e => this.navi(e)} />
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

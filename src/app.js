/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {NavigationControl} from 'react-map-gl';

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
};

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 30.785164,
        longitude: 120.41669,
        zoom: 8,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
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
  navi(e) {
    // TODO
  }

  render() {
    // viewport obj is ref to Root.state;
    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={v => {this.setState({viewport: v});console.log("viewportchanged event")}}
        preventStyleDiffing={false}
        mapboxApiAccessToken={token} >
        <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this._updateViewport} 
             onclick={e => this.navi(e)} />
          </div>
      </MapGL>
    );
  }

}

const root = document.createElement('div');
document.body.appendChild(root);

render(<Root />, root);
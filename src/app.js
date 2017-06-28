// app.js  global window..
/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {NavigationControl} from 'react-map-gl';

import ControlPanel from './control-panel';

//const token = process.env.MapboxAccessToken; // eslint-disable-line
const token = 'pk.eyJ1IjoiaHVhbmd5aXhpdSIsImEiOiI2WjVWR1hFIn0.1P90Q-tkbHS38BvnrhTI6w';

if (!token) {
  throw new Error('Please specify a valid mapbox token');
}

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
}

// React Component named App...
export default class App extends Component {

  constructor(props) {
    super(props);
    // store component props..
    this.state = {
      viewport: {
        latitude: 30.785164,
        longitude: 120.41669,
        zoom: 14,
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

  render() {

    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        onViewportChange={v => this.setState({viewport: v})}
        preventStyleDiffing={false}
        mapboxApiAccessToken={token} >


        <div className="nav" style={navStyle}>
          {/*<h4>Nav</h4>*/}
          {/*onViewportChange={this._updateViewport} */}
          {/*<NavigationControl />*/}
        </div>

        <ControlPanel />

      </MapGL>
    );
  }

}

// const root = document.createElement('div');
// document.body.appendChild(root);

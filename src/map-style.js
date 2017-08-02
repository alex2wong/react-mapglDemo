import {fromJS} from 'immutable';
import MAP_STYLE from '../assets/map-style-basic-v8.json';

// export multi object..
export const polyLayer = fromJS({
  id: 'polyLayer',
  source: 'polyLayer',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': '#ffeb3b',
    'fill-opacity': 0.8
  }
});

export const pointLayer = fromJS({
  id: 'point',
  source: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#ffeb3b'
  }
});

export const rasterStyle = fromJS({
  "version": 8,
  "name": "customRas",
  "sources": {
        "stamen": {
            // "tiles": ["https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"],
            "tiles": ["https://huangyixiu.co:3003/proxy/?proxyURI=http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"],
            // "tiles": ["http://www.google.cn/maps/vt?lyrs=s@702&gl=cn&x={x}&y={y}&z={z}"],
            "type": "raster",
            'tileSize': 256
        }
    },
  "layers": [
            {
                'id': 'custom-tms',
                'type': 'raster',
                'source': 'stamen',
                'paint': {}
            },
  ]
})

export const defaultMapStyle = fromJS(MAP_STYLE);

export function pointOnCircle({center, angle, radius}) {
  return {
    type: 'Point',
    coordinates: [
      // center[0] + Math.cos(angle) * radius,
      // center[1] + Math.sin(angle) * radius
      center[0],
      center[1]
    ]
  };
}

// input [x,y,x1,y1] return [[x,y], [x1,y1]]
function parseCoor(flatCoor) {
    var flatCoor = flatCoor.replace('[',"");
    flatCoor = flatCoor.replace(']',"");
    var coords = [], flatCoords = flatCoor.split(",");
    for (let i=0;i<flatCoords.length/2;i++) {
        let point = {};
        // which format do you output.. [x,y] or {latitude, longitude}
        // point.push(parseFloat(flatCoords[i*2]));
        // point.push(parseFloat(flatCoords[i*2+1]));
        point.longitude = parseFloat(flatCoords[i*2]);
        point.latitude = parseFloat(flatCoords[i*2+1]);
        coords.push(point);
    }
    return coords;
}

export function parseGaode(json) {
  let res = null, coords = [];
  if (typeof json == 'string') {
    res = JSON.parse(json);
  } else res = json;
  if (res.data && res.data.path_list 
    && res.data.path_list.length)
  {
    // get first routes plan.. [{},{}]
    let path = res.data.path_list[0];
    for (let i=0; i< path.path.length; i++) {
        let subPath = path.path[i];
        // each segment is a single road..
        for (let j=0; j< subPath.segments.length;j++) {
            let segment = subPath.segments[j];
            if (segment.coor === undefined) continue;
            coords.push(...parseCoor(segment.coor));
        }
    }
    console.log("parsed path with vertex num: " + coords.length);
  }

  return {
    type: 'Polyline',
    coordinates: coords
  }
}

import React, { useState, useMemo, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import { MapStylePicker } from '../controls';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import './About.css'
import RangeInput from './range-input';
import { mapboxAccessToken, INITIAL_VIEW_STATE, MAP_STYLE } from './utils';


export const colorRange = [
  [254, 240, 217],
  [253, 204, 138],
  [252, 141, 89],
  [227, 74, 51],
  [179, 0, 0],
];

// const limit = data.slice(0,100000)
// const obj = data.slice(1).map(([deviceId, lat, lng, speed, direction, error, acc, meter, ts]) => ({ deviceId, lat, lng, speed, direction, error, acc, meter, ts }))

// const newdata = obj.map(row => ({
//   timestamp: new Date(row.ts * 1000).getTime(),
//   latitude: Number(row.lat),
//   longitude: Number(row.lng),
//   speed: Number(row.speed),
// }));


function getTimeRange(data) {
  if (!data) {
    return null;
  }
  const myArray = data.map((d) => (
    d.timestamp
  ));

  let minElement = myArray[0];
  for (let i = 1; i < myArray.length; ++i) {
    if (myArray[i] < minElement) {
      minElement = myArray[i];
    }
  }

  let maxElement = myArray[0];
  for (let i = 1; i < myArray.length; ++i) {
    if (myArray[i] > maxElement) {
      maxElement = myArray[i];
    }
  }

  return [minElement, maxElement]


}

function formatLabel(t) {
  const date = new Date(t);
  const hour = date.getHours();
  if (hour % 24 >= 12) {
    return `${(hour % 12 || 12) + ' ' + 'PM'}`;
  }
  return `${(hour % 12 || 12) + ' ' + 'AM'}`;
}


function Heatmap({ data }) {


  const [filter, setFilter] = useState(null);
  const timeRange = useMemo(() => getTimeRange(data), [data])
  const [style, setState] = useState(MAP_STYLE)
  function onStyleChange(style) {
    setState(style)
  }
  const filterValue = filter || timeRange;
  let filteredData = data.filter(d => d.timestamp >= filterValue[0] && d.timestamp <= filterValue[1]);


  const layer = new HeatmapLayer({
    id: 'heatmp-layer',
    data: filteredData,
    colorRange,
    getPosition: d => [d.longitude, d.latitude],
    intensity: 1,
    threshold: 0.05,
    getFilterValue: d => d.timestamp,
    // filterRange: [filterValue[0], filterValue[1]],
    // extensions: [dataFilter],
    pickable: true
  })


  return (
    <div>


      {timeRange && (
        <RangeInput
          min={timeRange[0]}
          max={timeRange[1]}
          value={filterValue}
          animationSpeed={2000000}
          formatLabel={formatLabel}
          onChange={setFilter}
        />
      )}

      <div>

        <MapStylePicker onStyleChange={onStyleChange} currentStyle={style} />
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layer}

        >
          <Map
            reuseMaps
            mapStyle={style}
            mapboxAccessToken={mapboxAccessToken}
          />




        </DeckGL>




      </div>




    </div>


  )


}

export default Heatmap;


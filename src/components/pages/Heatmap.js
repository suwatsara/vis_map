import React, { useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import { MapStylePicker, LayerControls } from '../../controls';
import data from '../../data/gps_rama4_20181119.csv'
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { DataFilterExtension } from '@deck.gl/extensions';
import RangeInput from './range-input';



export const colorRange = [
  [254, 229, 217],
  [252, 187, 161],
  [252, 146, 114],
  [251, 106, 74],
  [222, 45, 38],
  [165, 15, 21]
];

const INITIAL_VIEW_STATE = {
  longitude: 100.535242,
  latitude: 13.727899,
  zoom: 14,
  pitch: 0,
  bearing: 0
};
const MapboxAccessToken = 'pk.eyJ1Ijoic2hmbHlmYWkiLCJhIjoiY2w1YnZwY2JvMDRhNjNjcjBweGd3MXdtNCJ9.iDGK4_CULLQl-xD-Q8r7Ew'
// const limit = data.slice(0,100000)
const obj = data.slice(1).map(([deviceId, lat, lng, speed, direction, error, acc, meter, ts]) => ({ deviceId, lat, lng, speed, direction, error, acc, meter, ts }))

const newdata = obj.map(row => ({
  timestamp: new Date(row.ts * 1000).getTime(),
  latitude: Number(row.lat),
  longitude: Number(row.lng),
  speed: Number(row.speed),
}));


function formatLabel(t) {
  const date = new Date(t);
  const hour = date.getHours();
  if(hour % 24 >=  12){
    return `${(hour % 12 || 12 )+ ' ' + 'PM'}`;
  }
  return `${(hour % 12 || 12) + ' '+ 'AM'}`;
}
git

const myArray = newdata.map((d) => (
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


const dataFilter = new DataFilterExtension({
  filterSize: 1,
  fp64: false
});


const MS_PER_DAY = 8.64e7;


function Heatmap({ data = newdata }) {


  const [filter, setFilter] = useState(null);
  const timeRange = [minElement, maxElement]
  const filterValue = filter || timeRange;
  let filteredData = data.filter(d => d.timestamp >= filterValue[0] && d.timestamp <= filterValue[1]);

  const layer = new HeatmapLayer({
    id: 'heatmp-layer',
    data: filteredData,
    colorRange,
    getPosition: d => [d.longitude, d.latitude],
    intensity: 1,
    threshold: 0.05,
    // getFilterValue: d => d.timestamp,
    // filterRange: [filterValue[0], filterValue[1]],
    // extensions: [dataFilter],
    pickable: true
  })


  

  const MAP_STYLE = 'mapbox://styles/mapbox/light-v9'

  const [style, setState] = useState(MAP_STYLE)

  function onStyleChange(style) {
    setState(style)
  }

  return (
    <div>
      <LayerControls />
      <MapStylePicker onStyleChange={onStyleChange} currentStyle={style} />
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layer}


      >
        <Map
          reuseMaps
          mapStyle={style}
          mapboxAccessToken={MapboxAccessToken}
        />

      </DeckGL>
      {timeRange && (
        <RangeInput
          min={timeRange[0]}
          max={timeRange[1]}
          value={filterValue}
          animationSpeed={1000000}
          formatLabel={formatLabel}
          onChange={setFilter}
        />
      )}


    </div>


  )


}

export default Heatmap;


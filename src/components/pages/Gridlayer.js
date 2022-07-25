import React, { useState} from 'react';
import { GridLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import { MapStylePicker } from '../../controls';
import data from '../../data/gps_rama4_20181119.csv'
import { LayerControls } from '../../controls';

const INITIAL_VIEW_STATE = {
  longitude: 100.535242,
  latitude: 13.727899,
  zoom: 14,
  pitch: 30,
  bearing: 0
};
const MapboxAccessToken = 'pk.eyJ1Ijoic2hmbHlmYWkiLCJhIjoiY2w1YnZwY2JvMDRhNjNjcjBweGd3MXdtNCJ9.iDGK4_CULLQl-xD-Q8r7Ew'
const obj = data.slice(1).map(([deviceId, lat, lng, speed, direction, error, acc, meter, ts]) => ({ deviceId, lat, lng, speed, direction, error, acc, meter, ts }))

function GridLayer({
  data = obj
}) {


  const layer = new GridLayer({
    id: 'new-grid-layer',
    data,
    pickable: true,
    extruded: true,
    cellSize: 100,
    elevationScale: 4,
    getPosition: d => [Number(d.lng), Number(d.lat)],
    // getFillColor: [0, 128, 255],
    // pickable: false,
    // radiusPixels: 10,

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
        getTooltip={({object}) => object && `${object.position.join(', ')}\nCount: ${object.count}`}

        >
      <Map
        reuseMaps
        mapStyle={style}
        mapboxAccessToken={MapboxAccessToken}
      />

    </DeckGL>

      </div >


    )



}

export default GridLayer;
import React, { useState } from 'react';
import { Map } from 'react-map-gl';
import data from '../../data/gps_rama4_20181119.csv';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import icon from '../../data/location-icon-atlas.png'
import file from '../../data/location-icon-mapping.json'
import IconClusterLayer from '../IconClusterLayer';
import { LayerControls, MapStylePicker } from '../../controls';

const mapboxAccessToken = 'pk.eyJ1Ijoic2hmbHlmYWkiLCJhIjoiY2w1YnZwY2JvMDRhNjNjcjBweGd3MXdtNCJ9.iDGK4_CULLQl-xD-Q8r7Ew'

const obj = data.slice(1).map(([deviceId, lat, lng, speed, direction, error, acc, meter, ts]) => ({ deviceId, lat, lng, speed, direction, error, acc, meter, ts }))
const INITIAL_VIEW_STATE = {
  longitude: 100.535242,
  latitude: 13.727899,
  zoom: 12,
  pitch: 0,
  bearing: 0
};
const MAP_VIEW = new MapView({ repeat: true });




export default function Cluster({
  data = obj,
  iconMapping = file,
  iconAtlas = icon,
  showCluster = true,
}) {
  const layerProps = {
    data,
    pickable: true,
    getPosition: d => [Number(d.lng), Number(d.lat)],
    iconAtlas,
    iconMapping,
  };

  const layer = showCluster
    ? new IconClusterLayer({ ...layerProps, id: 'icon-cluster', sizeScale: 40 })
    : new IconLayer({
      ...layerProps,
      id: 'icon',
      getIcon: d => 'marker',
      sizeUnits: 'meters',
      sizeScale: 35,
      sizeMinPixels: 6
    });

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
        layers={[layer]}
        views={MAP_VIEW}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <Map reuseMaps mapStyle={style} preventStyleDiffing={true} mapboxAccessToken={mapboxAccessToken} />

      </DeckGL>


    </div>

  );
}



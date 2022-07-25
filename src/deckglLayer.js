import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Map } from 'react-map-gl';
import data from './data/gps_rama4_20181119.csv'
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';
import {IconLayer} from '@deck.gl/layers';
import icon from './data/location-icon-atlas.png'
import file from './data/location-icon-mapping.json'
import IconClusterLayer from './components/IconClusterLayer';

const mapboxAccessToken = 'pk.eyJ1Ijoic2hmbHlmYWkiLCJhIjoiY2w1YnZwY2JvMDRhNjNjcjBweGd3MXdtNCJ9.iDGK4_CULLQl-xD-Q8r7Ew'

const obj = data.slice(1).map(([deviceId, lat, lng, speed, direction, error, acc, meter, ts]) => ({ deviceId, lat, lng, speed, direction, error, acc, meter, ts }))
const INITIAL_VIEW_STATE = {
  longitude: 100.535242,
  latitude: 13.727899,
  zoom: 1.8,
  maxZoom: 20,
  pitch: 0,
  bearing: 0
};
const MAP_VIEW = new MapView({repeat: true});
const MapStyle = 'mapbox://styles/mapbox/streets-v11'

export default function DeckglLayer({
  data = obj ,
  iconMapping = file,
  iconAtlas = icon,
  showCluster = true,
  mapStyle = MapStyle
}) {
  const layerProps = {
    data,
    pickable: true,
    getPosition: d => [Number(d.lng), Number(d.lat)],
    iconAtlas,
    iconMapping,
  };

  const layer = showCluster
    ? new IconClusterLayer({...layerProps, id: 'icon-cluster', sizeScale: 40})
    : new IconLayer({
        ...layerProps,
        id: 'icon',
        getIcon: d => 'marker',
        sizeUnits: 'meters',
        sizeScale: 2000,
        sizeMinPixels: 6
      });

  return (
    <DeckGL
      layers={[layer]}
      views={MAP_VIEW}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}

    >
      <Map reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} mapboxAccessToken={mapboxAccessToken} />

    </DeckGL>
  );
}




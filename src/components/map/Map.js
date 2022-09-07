import React, { useState, useCallback } from "react";
import {
  StaticMap,
  _MapContext as MapContext,
  NavigationControl,
} from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { MapStylePicker } from "../ControlPanel/MapStylePicker";
import { mapboxAccessToken, MAP_STYLE } from "../pages/utils";

function getTooltip({ object }) {
  if (!object) {
    return null;
  }
  const lat = object.position[1];
  const lng = object.position[0];
  const count = object.points.length;

  return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ""}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ""}
    ${count} point`;
}

const Map = (props) => {
  const {
    layers,
    viewport,
    info,
    layerVisibility,
    expandTooltip,
  } = props;
  const MAP_VIEW = new MapView({
    id: "base-map",
    controller: true,
    repeat: true,
  });

  const [style, setState] = useState(MAP_STYLE);
  const gridview = {...viewport, pitch:55,zoom:12}
  function onStyleChange(style) {
    setState(style);
  }

  function renderTooltip(info) {
    const { object, x, y } = info;
    if (!object) {
      return null;
    }

    return object.cluster ? (
      <div className="tooltip" style={{ left: x, top: y }}>
        {object.point_count_abbreviated} points
      </div>
    ) : (
      <div className="tooltip" style={{ left: x, top: y }}>
        {object.longitude} {object.latitude}
      </div>
    );
  }


  return (
    <>
      <MapStylePicker onStyleChange={onStyleChange} currentStyle={style} />
      <DeckGL
        ContextProvider={MapContext.Provider}
        layers={layers}
        initialViewState={layerVisibility.grid? gridview :viewport}
        controller={true}
        onClick={expandTooltip}
        views={MAP_VIEW}
        getTooltip={
           !layerVisibility.scatter && getTooltip
        }
      >
        <StaticMap
          reuseMaps
          mapStyle={style}
          mapboxApiAccessToken={mapboxAccessToken}
        />
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            right: 40,
            bottom: 120,
          }}
        >
          <NavigationControl visualizePitch={true} />
        </div>
        {renderTooltip(info)}
      </DeckGL>
    </>
  );
};

export default Map;

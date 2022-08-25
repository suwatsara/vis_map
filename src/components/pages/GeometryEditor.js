import React, { useState } from "react";
import { Map, Marker } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "./About.css";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { EditableGeoJsonLayer, SelectionLayer } from "@nebula.gl/layers";
import { DrawCircleFromCenterMode, DrawRectangleMode } from "react-map-gl-draw";
import { mapboxAccessToken, INITIAL_VIEW_STATE, MAP_STYLE } from "./utils";
import CropDinIcon from "@mui/icons-material/CropDin";
import PolylineIcon from "@mui/icons-material/Polyline";
import "./GeometryEditor.css";
// import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";

function GeometryEditor({ data }) {
  const [selected, setSelected] = useState([]);
  const radius = 5;

  const [features, setFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [mode, setMode] = useState("rectangle");
  const [selectedFeatureIndexes] = useState([]);

  const selectedLayer = new ScatterplotLayer({
    id: "scatter-plot-selected",
    data: selected,
    radiusScale: 1.1,
    radiusMinPixels: 0.25,
    getPosition: (d) => {
      return [d.longitude, d.latitude];
    },
    getFillColor: [255, 0, 0],
    getRadius: radius,
    pickable: true,
  });

  const layers = [
    new ScatterplotLayer({
      id: "scatter-plot-4",
      data,
      radiusScale: radius,
      radiusMinPixels: 0.25,
      getPosition: (d) => [d.longitude, d.latitude],
      getFillColor: (d) => [255, 140, 0],
      getRadius: 1,
      pickable: true,
    }),
    selectedLayer,
    new SelectionLayer({
      id: "selection",
      selectionType: mode,
      onSelect: ({ pickingInfos }) => {
        const newObjs = [];
        for (const obj of pickingInfos) {
          newObjs.push(obj.object);
        }
        setSelected(newObjs);
      },
      layerIds: ["scatter-plot-4"],
      getTentativeFillColor: () => [255, 252, 196, 100],
      getTentativeLineColor: () => [0, 0, 0, 100],
      getTentativeLineDashArray: () => [0, 0],
      lineWidthMinPixels: 1,
    }),
  ];

  console.log(selected);

  return (
    <div className="map">
      {data && <p> Selected area represents {selected.length} GPS points </p>}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={{
          doubleClickZoom: false,
        }}
        layers={[layers]}
      >
        <Map
          reuseMaps
          mapboxAccessToken={mapboxAccessToken}
          mapStyle={MAP_STYLE}
        />
      </DeckGL>
      <div className="wrapper">
        <button className="button" onClick={() => setMode("rectangle")}>
          <CropDinIcon />
        </button>
        <button className="button" onClick={() => setMode("polygon")}>
          <PolylineIcon />
        </button>
      </div>
    </div>
  );
}

export default GeometryEditor;

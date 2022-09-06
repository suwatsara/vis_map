import React, { useState, useMemo, useCallback } from "react";
import Map from "react-map-gl";
import * as d3 from "d3";
import { useRecoilState, useRecoilValue } from 'recoil';
import DeckGL from "@deck.gl/react";
import { HeatmapLayer, GridLayer, HexagonLayer } from "@deck.gl/aggregation-layers";
import { MapView } from "@deck.gl/core";
import { SelectionLayer } from "@nebula.gl/layers";
import { IconLayer, ScatterplotLayer, ArcLayer } from "@deck.gl/layers";
import IconClusterLayer from "./IconClusterLayer";
import { MapStylePicker } from "../controls";
import "./About.css";
import Chart from "./Chart";
import RangeInput from "./range-input";
import { mapboxAccessToken, layerState, MAP_STYLE, viewportState } from "./utils";
import CropDinIcon from "@mui/icons-material/CropDin";
import PolylineIcon from "@mui/icons-material/Polyline";
import EditIcon from "@mui/icons-material/Edit";
import "./GeometryEditor.css";
import Panel from "./Panel";
import ButtonLayer from "./ButtonLayer";

const MAP_VIEW = new MapView({ id: 'base-map', controller: true, repeat: true});

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

export const colorRange = [
  [254, 229, 217],
  [252, 174, 145],
  [251, 106, 74],
  [222, 45, 38],
  [165, 15, 21],
];

function getTimeRange(data) {
  if (!data) {
    return null;
  }


  const myArray = data.map((d) => d.timestamp);

  for (let i = 0; i < myArray.length; ++i) {
    if (myArray[0] === false || Number.isNaN(myArray[0])) {
      return [];
    }
  }

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

  return [minElement, maxElement];
}

function formatLabel(t) {
  const date = new Date(t);
  const formatDate = d3.timeFormat("%d/%m/%y, %I %p");
  // if (hour % 24 >= 12) {
  //   return `${day}, ${+ (hour % 12 || 12) + " " + "PM"}`;
  // }
  return formatDate(date)




}

export default function Cluster({
  data,
  showCluster = true,
  viewport,
}) {


  const [layerVisibility, setLayerVsisibility] = useRecoilState(layerState);
  const [filter, setFilter] = useState(null);
  const timeRange = useMemo(() => getTimeRange(data), [data]);

  const filterValue = filter || timeRange;
  let filteredData = data.filter(
    (d) => d.timestamp >= filterValue[0] && d.timestamp <= filterValue[1]
  );
  const [hoverInfo, setHoverInfo] = useState({}); //hover info clsuter map
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState(null);
  const radius = 5;
  let filteredSelected = selected.filter(
    (d) => d.timestamp >= filterValue[0] && d.timestamp <= filterValue[1]
  );

  const getTooltip = ({ object }) => object && `${object.position.join(", ")}\ncount: ${object.count}`;

  const valid = data[0] && new Date(data[0].timestamp).getTime() > 0;

  const selectedLayer = new ScatterplotLayer({
    id: "scatter-plot-selected",
    data: filteredSelected,
    radiusScale: radius,
    radiusMinPixels: 2,
    getPosition: (d) => {
      return [d.longitude, d.latitude];
    },
    getFillColor: [255, 0, 0],
    getRadius: 4,
    pickable: true,
    visible: layerVisibility.scatter,
  });

  const expandTooltip = (info) => {
    if (info.picked && showCluster) {
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const [style, setState] = useState(MAP_STYLE);

  function onStyleChange(style) {
    setState(style);
  }

  const layerProps = {
    data: filteredData,
    pickable: true,
    getPosition: (d) => [d.longitude, d.latitude],
    getFilterValue: (d) => d.timestamp,
    visible: layerVisibility.cluster,
    onHover: !hoverInfo.objects && setHoverInfo,
  };

  const layer1 = showCluster
    ? new IconClusterLayer({ ...layerProps, id: "icon-cluster", sizeScale: 40 })
    : new IconLayer({
      ...layerProps,
      id: "icon",
      getIcon: (d) => "marker",
      sizeUnits: "meters",
      sizeScale: 40,
      sizeMinPixels: 5,
    });

  const layer2 = new HexagonLayer({
    id: "heatmp-layer",
    data: filteredData,
    colorRange,
    getColorWeight: point => 1,
    colorAggregation: 'SUM',
    // colorScaleType: 'quantile',
    getPosition: (d) => [d.longitude, d.latitude],
    // getWeight: (d) => d.speed,
    // intensity: 1,
    // threshold: 0.05,
    getFilterValue: (d) => d.timestamp,
    // debounceTimeout: 1000,
    visible: layerVisibility.heatmap,
    pickable: true,
    radius: 120,
  });

  const layer3 = new GridLayer({
    id: "new-grid-layer",
    data: filteredData,
    pickable: true,
    extruded: true,
    colorRange,
    getColorWeight: point => 1,
    colorAggregation: 'SUM',
    // colorScaleType: 'quantile',
    cellSize: 120,
    elevationScale: 5,
    getPosition: (d) => [d.longitude, d.latitude],
    getFilterValue: (d) => d.timestamp,
    visible: layerVisibility.grid
  });

  const layer4 = [
    new ScatterplotLayer({
      id: "scatter-plot-4",
      data: filteredData,
      radiusScale: radius,
      radiusMinPixels: 2,
      getPosition: (d) => [d.longitude, d.latitude],
      getFillColor: (d) => [255, 140, 0],
      getRadius: 4,
      visible: layerVisibility.scatter,
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
      getTentativeFillColor: () => [255, 0, 255, 100],
      getTentativeLineColor: () => [0, 0, 255, 255],
      getTentativeLineDashArray: () => [0, 0],
      lineWidthMinPixels: 1,
      visible: layerVisibility.scatter,

    }),
  ];


  const layers = [layer1, layer2, layer3, layer4];


  return (
    <div className="map">
      <div>
        <MapStylePicker onStyleChange={onStyleChange} currentStyle={style} />
        <ButtonLayer
          layerVisibility={layerVisibility}
          setLayerVsisibility={setLayerVsisibility}
        />
        <Panel
          data={filteredData}
          selected={filteredSelected}
          layerVisibility={layerVisibility}
        />
        {layerVisibility.scatter && (
          <>
            <div className="wrapper">
              <button className="button" type="button" title="rectangle" onClick={() => setMode("rectangle")}>
                <CropDinIcon />
              </button>
              <button className="button" type="button" title="polyline" onClick={() => setMode("polygon")}>
                <PolylineIcon />
              </button>
              <button className="button" type="button" title="cancel" onClick={() => setMode(null)}>
                <EditIcon />
              </button>
            </div>
          </>
        )}
        <Chart data={data} />

        {valid && (
          <RangeInput
            min={timeRange[0]}
            max={timeRange[1]}
            value={filterValue}
            animationSpeed={layerVisibility.heatmap ? 1200000 : 70000}
            formatLabel={formatLabel}
            onChange={setFilter}
          />
        )}

        <DeckGL
          layers={layers}
          views={MAP_VIEW}
          initialViewState={viewport}
          controller={{
            doubleClickZoom: false,
          }}
          onClick={expandTooltip}
          getTooltip={
            layerVisibility.grid ? getTooltip :
              layerVisibility.heatmap && (({ object }) =>
                object &&
                `${object.position.join(", ")}\ncount: ${object.colorValue}`
              )
          }
        >

          <Map
            reuseMaps
            mapStyle={style}
            mapboxAccessToken={mapboxAccessToken}
          >

          </Map>
          {renderTooltip(hoverInfo)}
        </DeckGL>
      </div>
    </div>
  );
}

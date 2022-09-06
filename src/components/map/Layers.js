import React, { useState, useMemo, useCallback } from "react";
import { useRecoilState } from "recoil";
import IconClusterLayer from "./IconClusterLayer";
import * as d3 from "d3";
import ButtonLayer from "../ControlPanel/ButtonLayer";
import BarChart from "../Chart/Barchart";
import {
  HeatmapLayer,
  GridLayer,
  HexagonLayer,
} from "@deck.gl/aggregation-layers";
import RangeInput from "../RangeInput/RangeInput";
import { SelectionLayer } from "@nebula.gl/layers";
import "./GeometryEditor.css";
import { IconLayer, ScatterplotLayer, ArcLayer } from "@deck.gl/layers";
import { layerState } from "../pages/utils";
import Map from "./Map";
import InfoPanel from "../InfoPanel/InfoPanel";
import EditPanel from "./EditPanel";

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

export const colorRange = [
  [254, 229, 217],
  [252, 174, 145],
  [251, 106, 74],
  [222, 45, 38],
  [165, 15, 21],
];

function formatLabel(t) {
  const date = new Date(t);
  const formatDate = d3.timeFormat("%d/%m/%y, %I %p");
  // if (hour % 24 >= 12) {
  //   return `${day}, ${+ (hour % 12 || 12) + " " + "PM"}`;
  // }
  return formatDate(date);
}

function Layers({ data, showCluster = true, viewport}) {
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

  const valid = data[0] && new Date(data[0].timestamp).getTime() > 0;

  let color_domain = [0, 1];
  let max_points = 5;
  const [mingridValue, setMingridvalue] = useState(1);
  const [maxgridValue, setMaxgridvalue] = useState(5);

  const [minheatValue, setMinheatvalue] = useState(1);
  const [maxheatValue, setMaxheatvalue] = useState(5);

  const expandTooltip = (info) => {
    if (info.picked && showCluster) {
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

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
    getColorWeight: (point) => 1,
    colorAggregation: "SUM",
    // colorScaleType: 'quantile',
    getPosition: (d) => [d.longitude, d.latitude],
    // getWeight: (d) => d.speed,
    // intensity: 1,
    // threshold: 0.05,
    getFilterValue: (d) => d.timestamp,
    // debounceTimeout: 1000,
    pickable: true,
    // extruded: true,
    radius: 80,
    getColorValue: (points) => {
      if (points.length > max_points) {
        max_points = points.length;
      }
      return points.length;
    },
    onSetColorDomain: (ecol) => {
      color_domain = ecol;
      setMinheatvalue(ecol[0]);
      setMaxheatvalue(ecol[1]);
    },
    visible: layerVisibility.heatmap,
  });

  const layer3 = new GridLayer({
    id: "new-grid-layer",
    data: filteredData,
    pickable: true,
    extruded: true,
    colorRange,
    getColorWeight: (point) => 1,
    colorAggregation: "SUM",
    // colorScaleType: 'quantile',
    cellSize: 130,
    elevationScale: 4,
    getColorValue: (points) => {
      if (points.length > max_points) {
        max_points = points.length;
      }
      return points.length;
    },
    onSetColorDomain: (ecol) => {
      color_domain = ecol;
      setMingridvalue(ecol[0]);
      setMaxgridvalue(ecol[1]);
    },
    getPosition: (d) => [d.longitude, d.latitude],
    getFilterValue: (d) => d.timestamp,
    visible: layerVisibility.grid,
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
    <div>
      <ButtonLayer
        layerVisibility={layerVisibility}
        setLayerVsisibility={setLayerVsisibility}
      />
      <InfoPanel
        data={filteredData}
        selected={filteredSelected}
        layerVisibility={layerVisibility}
        min={layerVisibility.grid ? mingridValue : minheatValue}
        max={layerVisibility.grid ? maxgridValue : maxheatValue}
      />


      {layerVisibility.scatter && <EditPanel setMode={setMode} />}

      <BarChart data={data} />

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

      <Map
        layers={layers}
        viewport={viewport}
        info={hoverInfo}
        layerVisibility={layerVisibility}
        expandTooltip={expandTooltip}
      />
    </div>
  );
}

export default Layers;

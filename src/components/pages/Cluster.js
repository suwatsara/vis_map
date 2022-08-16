import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Map } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer, GridLayer } from '@deck.gl/aggregation-layers';
import { MapView } from '@deck.gl/core';
import { EditableGeoJsonLayer, SelectionLayer } from "@nebula.gl/layers";
import { IconLayer, ScatterplotLayer } from '@deck.gl/layers';
import icon from '../../data/location-icon-atlas.png'
import file from '../../data/location-icon-mapping.json'
import IconClusterLayer from './IconClusterLayer';
import { MapStylePicker } from '../controls';
import './About.css'
import styled from 'styled-components';
import RangeInput from './range-input';
import Chart from './Chart';
import { mapboxAccessToken, INITIAL_VIEW_STATE, MAP_STYLE } from './utils';
import CropDinIcon from '@mui/icons-material/CropDin';
import PolylineIcon from '@mui/icons-material/Polyline';
import EditIcon from '@mui/icons-material/Edit';
import './GeometryEditor.css'


const MAP_VIEW = new MapView({ repeat: true });

function renderTooltip(info) {
	const { object, x, y } = info;
	if (!object) {
		return null;
	}

	return object.cluster ? (
		<div className="tooltip" style={{ left: x, top: y }}>
			{object.point_count_abbreviated} records
		</div>
	) : (
		<div className="tooltip" style={{ left: x, top: y }}>
			{object.latitude} {object.longitude}
		</div>
	);

}

export const colorRange = [
	[254, 240, 217],
	[253, 204, 138],
	[252, 141, 89],
	[227, 74, 51],
	[179, 0, 0],
];


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


export default function Cluster({
	data,
	iconMapping = file,
	iconAtlas = icon,
	showCluster = true,

}) {

	const [filter, setFilter] = useState(null);
	const timeRange = useMemo(() => getTimeRange(data), [data])
	const filterValue = filter || timeRange;
	let filteredData = data.filter(d => d.timestamp >= filterValue[0] && d.timestamp <= filterValue[1]);
	const [hoverInfo, setHoverInfo] = useState({}); //hover info clsuter map
	const [gridInfo, setGridInfo] = useState({}); // hover info gridlayer
	const [selected, setSelected] = useState([]);
	const [mode, setMode] = useState(null);
	const radius = 5;

	const selectedLayer = new ScatterplotLayer({
		id: "scatter-plot-selected",
		data: selected,
		radiusScale: radius,
		radiusMinPixels: 2,
		getPosition: (d) => {
			return [d.longitude, d.latitude];
		},
		getFillColor: [255, 0, 0],
		getRadius: 4,
		pickable: true
	});



	const hideTooltip = () => {
		setHoverInfo({});
	};
	const expandTooltip = info => {
		if (info.picked && showCluster) {
			setHoverInfo(info);
		} else {
			setHoverInfo({});
		}
	};

	const [style, setState] = useState(MAP_STYLE)

	function onStyleChange(style) {
		setState(style)
	}


	const layerProps = {
		data: filteredData,
		pickable: true,
		getPosition: d => [d.longitude, d.latitude],
		iconAtlas,
		iconMapping,
		getFilterValue: d => d.timestamp,
		onHover: !hoverInfo.objects && setHoverInfo
	};


	const layer1 =
		showCluster
			? new IconClusterLayer({ ...layerProps, id: 'icon-cluster', sizeScale: 40, })
			: new IconLayer({
				...layerProps,
				id: 'icon',
				getIcon: d => 'marker',
				sizeUnits: 'meters',
				sizeScale: 35,
				sizeMinPixels: 6,


			})

	const layer2 =
		new HeatmapLayer({
			id: 'heatmp-layer',
			data: filteredData,
			colorRange,
			getPosition: d => [d.longitude, d.latitude],
			intensity: 1,
			threshold: 0.05,
			getFilterValue: d => d.timestamp,
			debounceTimeout:1000,
			radiusPixels:35,


		})

	const layer3 = new GridLayer({
		id: 'new-grid-layer',
		data: filteredData,
		pickable: true,
		extruded: true,
		cellSize: 100,
		elevationScale: 4,
		getPosition: d => [d.longitude, d.latitude],
		getFilterValue: d => d.timestamp,
		// onHover: info => setGridInfo(info),
	})

	const layer4 = [
		new ScatterplotLayer({
			id: "scatter-plot-4",
			data: filteredData,
			radiusScale: radius,
			radiusMinPixels: 2,
			getPosition: (d) => [d.longitude, d.latitude],
			getFillColor: d => [255, 140, 0],
			getRadius: 4,
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
			lineWidthMinPixels: 1
		})

	];

	const LAYERS = [
		{ label: 'Cluster Layer', value: 0 },
		{ label: 'Heatmap', value: 1 },
		{ label: 'Gridlayer', value: 2 },
		{ label: 'Scatterplot', value: 3 }
	];


	const [activeLayer, setActiveLayer] = useState(0);

	const getLayers = () => {
		if (activeLayer === 0) return layer1;
		if (activeLayer === 1) return layer2;
		if (activeLayer === 2) return layer3;
		if (activeLayer === 3) return layer4;
	};

	const onLayerChange = (activeLayer) => {
		setActiveLayer(activeLayer)
	};

	return (
		<div className='map'>

				<RangeInput
					min={timeRange[0]}
					max={timeRange[1]}
					value={filterValue}
					animationSpeed={300000}
					formatLabel={formatLabel}
					onChange={setFilter}
				/>

			<div >
				<MapStylePicker onStyleChange={onStyleChange} currentStyle={style} />

				<SelectItem
					className="layer-picker"
					value={activeLayer}
					onChange={e => onLayerChange(Number(e.target.value))}
				>
					{LAYERS.map(layer => (
						<option key={layer.value} value={layer.value}>
							{layer.label}
						</option>
					))}
				</SelectItem>

				<DeckGL
					layers={getLayers()}
					views={MAP_VIEW}
					initialViewState={INITIAL_VIEW_STATE}
					controller={{
						doubleClickZoom: false
					}}
					onViewStateChange={hideTooltip}
					onClick={expandTooltip}
					getTooltip={activeLayer === 2 && (({object}) => object && `${object.position.join(', ')}\nCount: ${object.count}`) }

				>

					<Map reuseMaps mapStyle={style} mapboxAccessToken={mapboxAccessToken} />
					{renderTooltip(hoverInfo)}
				</DeckGL>
				{activeLayer === 3 && (
					<>
						<p className='wrapper'> Selected area represents {selected.length} GPS points </p>
						<div className="wrapper">

							<button className="button"
								onClick={() => setMode("rectangle")}
							>
								<CropDinIcon />
							</button>
							<button className="button"
								onClick={() => setMode("polygon")}
							>
								<PolylineIcon />
							</button>
							<button className="button"
								onClick={() => setMode(null)}
							>
								<EditIcon />
							</button>
						</div>
					</>
				)
				}
				<p className={activeLayer === 3 ? 'count wrapper' : 'gps_count'}>GPS Count: {filteredData.length} points</p>
				
				<Chart data={filteredData} />

			</div>


		</div>

	);
}


const SelectItem = styled.select`
    height:45px;
    width: 145px;
	align-items: center;
	justify-content: center;
    background: white;
    color: black;
	position: absolute;
	border-radius: 4px;
    top: 14px;
    right: 169px;
    font-size: 14px;
    padding: 0 30px 0 10px;
    margin: 0 5px 5px 0;
    border: transparent;
    border-radius: 3px;
	z-index: 1;
	-webkit-appearance: none;
  	-moz-appearance: none;
  	appearance: none;
  	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC');
  	background-repeat: no-repeat;
  	background-position: 112px center;
	cursor: pointer;
  option {
    color: black;
    background: white;
    display: flex;
	border:transparent;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 2px;
  }
`;



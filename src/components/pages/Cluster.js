import React, { useState, useMemo, useEffect } from 'react';
import { Map } from 'react-map-gl';
import data from '../../data/gps_rama4_20181119.csv';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { MapView } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import icon from '../../data/location-icon-atlas.png'
import file from '../../data/location-icon-mapping.json'
import IconClusterLayer from './IconClusterLayer';
import { MapStylePicker } from '../controls';
import './About.css'
import RangeInput from './range-input';
import { mapboxAccessToken, INITIAL_VIEW_STATE, MAP_STYLE } from './utils';


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

	const [hoverInfo, setHoverInfo] = useState({});

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
			// filterRange: [filterValue[0], filterValue[1]],
			// extensions: [dataFilter],
			pickable: true,


		})

	const [activeLayer, setActiveLayer] = useState(0);
	const [buttonText, setButtonText] = useState('Show Heat Map');


	const getLayers = () => {
		if (activeLayer === 0) return layer1;
		return layer2;
	};
	const changeLayer = () => {
		if (activeLayer === 0){
			setActiveLayer(1)
			setButtonText('Show Cluster');
		}
		else{
			setActiveLayer(0)
			setButtonText('Show Heat Map')}
		;
	};



	return (
		<div className='map'>

			{timeRange && (
				<RangeInput
					min={timeRange[0]}
					max={timeRange[1]}
					value={filterValue}
					animationSpeed={300000}
					formatLabel={formatLabel}
					onChange={setFilter}
				/>
			)}

			<div >
				<MapStylePicker onStyleChange={onStyleChange} currentStyle={style} />

				<button className='showmap' onClick={changeLayer}>
					{buttonText}
				</button>

				<DeckGL
					layers={getLayers()}
					views={MAP_VIEW}
					initialViewState={INITIAL_VIEW_STATE}
					controller={true}
					onViewStateChange={hideTooltip}
					onClick={expandTooltip}
				>
					<Map reuseMaps mapStyle={style} mapboxAccessToken={mapboxAccessToken} />
					{renderTooltip(hoverInfo)}
				</DeckGL>


			</div>




		</div>

	);
}



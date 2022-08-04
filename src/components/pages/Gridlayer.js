import React, { useState, useMemo } from 'react';
import { GridLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import { MapStylePicker, LayerControls } from '../controls';
import data from '../../data/gps_rama4_20181119.csv'
import RangeInput from './range-input';
import { mapboxAccessToken, INITIAL_VIEW_STATE, MAP_STYLE } from './utils';


const obj = data.slice(1).map(([deviceId, lat, lng, speed, direction, error, acc, meter, ts]) => ({ deviceId, lat, lng, speed, direction, error, acc, meter, ts }))
const newdata = obj.map(row => ({
	timestamp: new Date(row.ts * 1000).getTime(),
	latitude: Number(row.lat),
	longitude: Number(row.lng),
	speed: Number(row.speed),
}));

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



function GridLayerDisplay({
	data = newdata
}) {

	const [style, setState] = useState(MAP_STYLE)

	function onStyleChange(style) {
		setState(style)
	}

	const [filter, setFilter] = useState(null);
	const timeRange = useMemo(() => getTimeRange(data), [data])
	const filterValue = filter || timeRange;
	let filteredData = data.filter(d => d.timestamp >= filterValue[0] && d.timestamp <= filterValue[1]);

	const layer = new GridLayer({
		id: 'new-grid-layer',
		data: filteredData,
		pickable: true,
		extruded: true,
		cellSize: 100,
		elevationScale: 4,
		getPosition: d => [d.longitude, d.latitude],
		getFilterValue: d => d.timestamp,
		// getFillColor: [0, 128, 255],
		// pickable: false,
		// radiusPixels: 10,

	})


	return (
		<div>
			<LayerControls />
			<MapStylePicker onStyleChange={onStyleChange} currentStyle={style} />
			<DeckGL
				initialViewState={INITIAL_VIEW_STATE}
				controller={true}
				layers={layer}
				getTooltip={({ object }) => object && `${object.position.join(', ')}\nCount: ${object.count}`}

			>
				<Map
					reuseMaps
					mapStyle={style}
					mapboxAccessToken={mapboxAccessToken}
				/>

			</DeckGL>

			{timeRange && (
				<RangeInput
					min={timeRange[0]}
					max={timeRange[1]}
					value={filterValue}
					animationSpeed={500000}
					formatLabel={formatLabel}
					onChange={setFilter}
				/>
			)}

		</div >


	)



}

export default GridLayerDisplay;
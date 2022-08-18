import React, { Component, useState } from 'react';
import styled from 'styled-components';
import './controls.css'
import Papa from "papaparse";


const MAPBOX_DEFAULT_MAPSTYLES = [
    { label: 'Streets V10', value: 'mapbox://styles/mapbox/streets-v10' },
    { label: 'Outdoors V10', value: 'mapbox://styles/mapbox/outdoors-v10' },
    { label: 'Light V9', value: 'mapbox://styles/mapbox/light-v9' },
    { label: 'Dark V9', value: 'mapbox://styles/mapbox/dark-v9' },
    { label: 'Satellite V9', value: 'mapbox://styles/mapbox/satellite-v9' },
];

export function MapStylePicker({ currentStyle, onStyleChange }) {
    return (
        <SelectItem
            className="map-style-picker"
            // style={mapStylePicker}
            value={currentStyle}
            onChange={e => onStyleChange(e.target.value)}
        >
            {MAPBOX_DEFAULT_MAPSTYLES.map(style => (
                <option key={style.value} value={style.value}>
                    {style.label}
                </option>
            ))}
        </SelectItem>

    );
}





export function LayerControls() {
    const [file, setFile] = useState();
	const [list, setList] = useState([]);
	const [selected, setSelected] = useState({ Lng: {}, Lat: {}, TimeStamp: {} });

	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
	};

	// const newdata = data.slice(0, 100)
	// const obj = newdata.slice(1).map(([deviceId, lat, lng, speed, direction, error, acc, meter, ts]) => ({ deviceId, lat, lng, speed, direction, error, acc, meter, ts }))
	const handleSubmit = (event) => {
		event.preventDefault();
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				// Parsed Data Response in array format
				// setList(processRowObject(results.data));
				const rowsArray = [];
				const valuesArray = [];

				// Iterating data to get column name and their values
				results.data.map((d) => {
					rowsArray.push(Object.keys(d));
					valuesArray.push(Object.values(d));
				});

				const headers = rowsArray[0]
				const refinedList = [];

				headers.forEach((header, index) => {
					// Get items from the rows at index of header
					const values = [];
					
					valuesArray.forEach((row) => {
						values.push(row[index].trim());
					});
					// push header and its values torefined list
					refinedList.push({
						name: header.trim(),
						values: values,
					});
				});

				// console.log(refinedList);
				// Set state...
				setList(refinedList);
			},
		})

	};


	const handleSelection = (event) => {
		event.preventDefault();
		const { x, y, z } = event.target.elements;
		// Find selected item...
		const lat = list.find((el) => el.name === x.value);
		const lng = list.find((el) => el.name === y.value);
		const time = list.find((el) => el.name === z.value);
		// Set selected x & y...
		setSelected({
			Lng: lng,
			Lat: lat,
			TimeStamp: time
		});
	};



    return (

        <div>


        <div className='ControlPanel'>
            <form onSubmit={handleSubmit} >
					<div className='upload'>
						<label>Dataset</label>
						<input
							type="file"
							name="file"
							accept=".csv,.xlsx,.xls,.xml"
							onChange={handleOnChange}
						/>
						<button type="submit">Process</button>

					</div>

				</form>

				<form onSubmit={handleSelection}>
					<div className="select">
						<label htmlFor="latitude">Latitude</label>
						<div className='custom-select'>
							<select
								id="latitude"
								name="x"
							>
								{list && list.map(option => (
									<option key={option.name} value={option.name}>
										{option.name}
									</option>
								))}
							</select>
						</div>

					</div>

					<div className="select">
						<label htmlFor="longitude">Longitude</label>
						<div className='custom-select'>
							<select
								id="longitude"
								name="y"
							>
								{list && list.map(option => (
									<option key={option.name} value={option.name}>
										{option.name}
									</option>
								))}
							</select>
						</div>

					</div>
					<div className='select'>
						<label htmlFor="Time Filter">Time</label>
						<div className='custom-select'>
							<select
								name="z"
								id="Time Filter"
							>
								{list && list.map(option => (
									<option key={option.name} value={option.name}>
										{option.name}
									</option>
								))}
							</select>
						</div>

					</div>
					<button type="submit">Apply</button>



				</form>




            {/* <div className='Radius'>
                    <label>Time Range</label>
                    <div className='slider'>
                        <input
                            type="range"
                            min="0"
                            max={MAX}
                            onChange={(e) => setValue(e.target.value)}
                            style={getBackgroundSize()}
                            value={value}
                        />
                        <div className='value'>{value}</div>

                    </div>

                </div> */}

            




        </div>



        </div>


    );
}


const SelectItem = styled.select`
    height:45px;
    width: 105px;
	align-items: center;
	justify-content: center;
    background: white;
    color: black;
	position: absolute;
	border-radius: 4px;
    top: 14px;
    right: 20px;
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
  	background-position: 75px center;
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







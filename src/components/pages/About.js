import React, { useState, useEffect, useMemo } from 'react';

import { processRowObject } from 'kepler.gl/processors';
// import data from '../../data/gps_rama4_20181119.csv';
import Papa from "papaparse";
import './About.css'
import Cluster from './Cluster';
import Heatmap from './Heatmap';
import ShowTable from './Table';

// import data from '../../data/gps_rama4_20181119.csv'




function About() {
	const [file, setFile] = useState();
	const [list, setList] = useState([]);
	const [selected, setSelected] = useState([{ Lng: {}, Lat: {}, TimeStamp: {} }]);
	const [loading, setLoading] = useState(false);

	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
	};


	const handleSubmit = (event) => {
		event.preventDefault();
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
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
					// Get items from the rows at index of header..

					const values = [];

					valuesArray.forEach((row) => {
						values.push(row[index].trim());
					});

					refinedList.push({
						name: header,
						values: values,
					});
				});

				// console.log(refinedList);
				// Set state...

				setList(refinedList);
				setLoading(true)
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


		// convert to number
		const newLat = lat && lat.values.map((d) => (Number(d)))
		const newLng = lng && lng.values.map((d) => (Number(d)))
		const newTime = time && time.values.map((d) => (
			new Date(Number(d) * 1000).getTime()
		))

		setSelected({
			Lng: newLng,
			Lat: newLat,
			TimeStamp: newTime
		});


	};
	// select only values
	const values = Object.values(selected)

	var arr = [];

	// Map each value from 
	// {Lat: [array], Lng: [array], TimeStamp: [array]} -> [[Lng, Lat, TimeStamp]]
	for (var i = 0; i < values[0].length; i++) {
		const col0 = values.map(d => d[i])
		arr.push(col0)
	}

	// [[Lng, Lat, TimeStamp]] -> {[{longitude: , latitude: , timestamp: }]}
	const obj = arr
		.map(([longitude, latitude, timestamp]) => ({ longitude, latitude, timestamp }));


	return (
		<div>
			<div className='ControlPanel'>

				<form onSubmit={handleSubmit} >
					<div className='upload'>
						<label>Upload CSV File</label>
						<input
							type="file"
							name="file"
							accept=".csv,.xlsx,.xls,.xml"
							onChange={handleOnChange}
						/>
						<button className='Process' type="submit">Process</button>

					</div>

				</form>
				{loading && (
					<>

						<form className='select-form' onSubmit={handleSelection}>
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
							<button className='Apply' type="submit">Apply</button>



						</form>



					</>
				)}





			</div>

			<div className='button-wrapper'>

				<Cluster data={obj} />

			</div>


			<ShowTable rows={obj} />







		</div>

	);
}



export default About
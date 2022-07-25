import React, { Component, useState } from 'react';
import styled from 'styled-components';
import { mapStylePicker } from './style';
import './controls.css'
import { format } from 'd3';

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
            style={mapStylePicker}
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

    const options = [
        { label: 'Field 1', value: '1' },
        { label: 'Field 2', value: '2' },
        { label: 'Field 3', value: '3' },
    ];


    return (

        <div className='ControlPanel'>
            <div className='upload'>
                <div>
                    <label>Dataset</label>
                    <br />
                    <input
                        type="file"
                        name="file"
                        accept=".csv,.xlsx,.xls,.xml"
                    />
                </div>
            </div>


            <div className="select">
                <label htmlFor="latitude">Latitude</label>
                <div className='custom-select'>
                    <select
                        id="latitude"
                    >
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            <div className="select">
                <label htmlFor="latitude">Longitude</label>
                <div className='custom-select'>
                    <select
                        id="latitude"
                    >
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

            </div>
            <div className='select'>
                <label htmlFor="Time Filter">Time</label>
                <div className='custom-select'>
                    <select
                        id="Time Filter"
                    >
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

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


    );
}


const SelectItem = styled.select`
    height:25px;
    width: 100px;
    background: white;
    color: gray;
    font-size: 14px;
    appearance: none;
    padding: 0 30px 0 10px;
    margin: 0 5px 5px 0;
    border: 1px solid #e0e0e0;
    border-radius: 3px;
  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;







import React from 'react';
import styled from 'styled-components';
import './controls.css'

const MAPBOX_DEFAULT_MAPSTYLES = [
    { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v10' },
    { label: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v10' },
    { label: 'Light', value: 'mapbox://styles/mapbox/light-v9' },
    { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v9' },
    { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
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


const SelectItem = styled.select`
    height:45px;
    width: 115px;
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
    margin: 0 0 5px 0;
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







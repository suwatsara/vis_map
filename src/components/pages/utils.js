import { atom } from 'recoil';


export const mapboxAccessToken = 'pk.eyJ1Ijoic2hmbHlmYWkiLCJhIjoiY2w1YnZwY2JvMDRhNjNjcjBweGd3MXdtNCJ9.iDGK4_CULLQl-xD-Q8r7Ew';

export const viewportState = atom({
	key: "mapState",
	default: {
		longitude: 100.535242,
		latitude: 13.727899,
		zoom: 10,
		maxZoom: 15,
		pitch: 12,
		bearing: 0
	}
});

export const MAP_STYLE = 'mapbox://styles/mapbox/light-v9';


export const layerState = atom({
	key: "layersState",
	default: {
		cluster: true,
		heatmap: false,
		grid: false,
		scatter: false
	}

});

const visualChannels = {
    colorField: {
        "name": "speed",
        "type": "real"
    },
    strokeColorField: null,
    strokeColorScale: "quantile",
    sizeField: null,
    sizeScale: "linear"
};

const cellConfig = {
    radius: 10,
    fixedRadius: false,
    opacity: 0.8,
    outline: false,
    thickness: 2,
    strokeColor: null,
    colorRange: {
        colors: [
            "#5A1846",
            "#900C3F",
            "#C70039",
            "#E3611C",
            "#F1920E",
            "#FFC300"
        ]
    },
    strokeColorRange: {
        colors: [
            "#5A1846",
            "#900C3F",
            "#C70039",
            "#E3611C",
            "#F1920E",
            "#FFC300"
        ]
    },
    radiusRange: [0, 50],
    filled: true
    ,
    hidden: false,
    textLabel: [
        {
            field: null,
            color: [
                255,
                255,
                255
            ],
            size: 18,
            offset: [
                0,
                0
            ],
            anchor: "start",
            alignment: "center"
        }
    ]
};

const layerConfig = {
    dataId: "map_data",
    label: "Gps data",
    columns: {
        "lat": "lat",
        "lng": "lng",
        "altitude": null
    },
    isVisible: true,
    visConfig: cellConfig
};

const config = {
    id: "point_layer",
    type: "point",
    config: layerConfig,
    visualChannels
};

const mapState = {
    "bearing": 0,
    "dragRotate": false,
    "latitude": 13.72589734596964,
    "longitude": 100.53142155866189,
    "pitch": 0,
    "zoom": 14,
    "isSplit": false
};

export default { config, mapState };
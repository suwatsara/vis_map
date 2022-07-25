const visualChannels = {
    colorField: {
        "name": "speed",
        "type": "real"
      },
      colorScale: "quantile"
};

const clusterConfig = {
    opacity: 0.8,
    clusterRadius: 26.9,
    colorRange: {

        colors: [
            "#ffffcc",
            "#c7e9b4",
            "#7fcdbb",
            "#41b6c4",
            "#2c7fb8",
            "#253494"
        ]
    },
    radiusRange: [
        0,
        50
    ],
    colorAggregation: "average",
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
    dataId: "m_data",
    label: "GPS data",
    columns: {
        "lat": "lat",
        "lng": "lng",
        "altitude": null
    },
    isVisible: true,
    visConfig: clusterConfig
};

const config = {
    id: "clsuter_layer",
    type: "cluster",
    config: layerConfig,
    visualChannels
};

const mapState = {
    "bearing": 0,
    "dragRotate": false,
    "latitude": 13.729477204199796,
    "longitude": 100.53265645051583,
    "pitch": 0,
    "zoom": 13.613099844184456,
    "isSplit": false
};

export default { config, mapState };
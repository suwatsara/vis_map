import clusterSettings from './ClusterLayer';
import pointSettings from './PointLayer';

export const MAP_MODE = {
    CLUSTER: "CLUSTER",
    POINT: "POINT"
  };
  
  function getModeSettings(mode) {
      switch(mode) {
          case MAP_MODE.CLUSTER:
            return clusterSettings;
          case MAP_MODE.POINT:
            return pointSettings;
          default:
            return pointSettings;
      }
  };
  
  const mapStyle = {
       styleType: "dark",
       topLayerGroups: {},
       visibleLayerGroups: {
          "label": true,
          "road": true,
          "border": false,
          "building": true,
          "water": true,
          "land": true,
          "3d building": false
       }
  };
  
  const interactionConfig = {
      tooltip: {
          fieldsToShow: {
              "map_data": [
                "deviceId",
                "meter",
                "acc"
              ]
          },
          enabled: true
      },
      brush: {
          enabled: false
      }
  };
  
  export function getMapConfig(mode) {
    
    const settings = getModeSettings(mode);
  
    return {
        version: "v1",
        config: {
          visState: {
            filters: [],
            layers: [ settings.config ],
            interactionConfig,
            layerBlending: "normal",
            splitMaps: []
          },
          mapState: settings.mapState,
          mapStyle
        }
    };
  };
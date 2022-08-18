import { CompositeLayer } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import Supercluster from 'supercluster';


function getIconSize(size) {
  return Math.min(100000, size) / 100000 + 1;
}

function createSVGIcon(size) {

  if (size === 1) {
    return `
  <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <g>
      <ellipse fill="#ffffcc" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>            
    </g>
 </svg>`;
  }

  if (size < 500) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <g>
      <ellipse fill="#c7e9b4" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
      </g>
 </svg>`;
  }

  if (size < 5000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
    <g>
      <ellipse fill="#7fcdbb" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
    </g>
 </svg>`;
  }

  if (size < 10000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
    <g>
      <ellipse fill="#41b6c4" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
    </g>
 </svg>`;
  }



  if (size < 50000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
    <g>
      <ellipse fill="#1d91c0" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>       
    </g>
 </svg>`;

  }
  if (size < 100000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
    <g>
      <ellipse fill="#225ea8" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>            
    </g>
 </svg>`;

  }
  return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
  <g>
    <ellipse fill="#0c2c84" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/> 
  </g>
 </svg>`;


}
function svgToDataURL(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}


export default class IconClusterLayer extends CompositeLayer {
  shouldUpdateState({ changeFlags }) {
    return changeFlags.somethingChanged;
  }

  updateState({ props, oldProps, changeFlags }) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (rebuildIndex) {
      const index = new Supercluster({ maxZoom: 16, radius: props.sizeScale * Math.sqrt(2) });
      index.load(
        props.data.map(d => ({
          geometry: { coordinates: props.getPosition(d) },
          properties: d
        }))
      );
      this.setState({ index });
    }

    const z = Math.floor(this.context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z
      });
    }
  }

  getPickingInfo({info, mode}) {
    const pickedObject = info.object && info.object.properties;
    if (pickedObject) {
      if (pickedObject.cluster && mode !== 'hover') {
        info.objects = this.state.index
          .getLeaves(pickedObject.cluster_id, 25)
          .map(f => f.properties);
      }
      info.object = pickedObject;
    }
    return info;
  }


  renderLayers() {
    const { data } = this.state;
    const { iconAtlas, iconMapping, sizeScale } = this.props;

    return new IconLayer(
        this.getSubLayerProps({
          id: 'icon',
          data,
          // iconAtlas,
          // iconMapping,
          sizeScale,
          getPosition: d => d.geometry.coordinates,
          // getIcon: d => getIconName(d.properties.cluster ? d.properties.point_count : 1),
          getIcon: (d, { index }) => {

            const dd = {
              url: svgToDataURL(createSVGIcon(d.properties.cluster ? d.properties.point_count : 1)),
              width: 128,
              height: 128
            }
            return dd;
          },
          getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
        })
      );
  }
}
import { CompositeLayer } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import Supercluster from 'supercluster';


function getIconSize(size) {
  return Math.min(10, size) / 10 + 1;
}

function createSVGIcon(size) {

  if (size === 1) {
    return `
  <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <g>
      <ellipse fill="rgb(252,187,161,0.8)" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>            
    </g>
 </svg>`;
  }
  if (size < 10) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <g>
      <ellipse fill="rgb(252,146,114,0.8)" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
      </g>
 </svg>`;
  }

  if (size < 100) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
    <g>
      <ellipse fill="rgb(251,106,74,0.8)" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
    </g>
 </svg>`;
  }

  if (size < 1000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
    <g>
      <ellipse fill="rgb(222,45,38,0.8)" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
    </g>
 </svg>`;
  }



//   if (size < 5000) {
//     return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
//     <g>
//       <ellipse fill="rgb(239,59,44,0.8)" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>       
//     </g>
//  </svg>`;

  // }
  // if (size < 100000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
    <g>
      <ellipse fill="rgb(165,15,21,0.8)" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>            
    </g>
 </svg>`;

  //  }
//   return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" >
//   <g>
//     <ellipse fill="rgb(153,0,13,0.8)" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/> 
//   </g>
//  </svg>`;


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
    const { sizeScale } = this.props;


    return new IconLayer(
        this.getSubLayerProps({
          id: 'icon',
          data,
          sizeScale,
          getPixelOffset: [0, 0],
          getPosition: d => d.geometry.coordinates,
          // getIcon: d => getIconName(d.properties.cluster ? d.properties.point_count : 1),
          getIcon: (d) => {

            const dd = {
              url: svgToDataURL(createSVGIcon(d.properties.cluster ? d.properties.point_count : 1)),
              width: 140,
              height: 140
            }
            return dd;
          },
          getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
        })
      );
  }
}
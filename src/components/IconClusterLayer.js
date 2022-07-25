import { CompositeLayer } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import Supercluster from 'supercluster';


// function getIconName(size) {
//   if (size === 0) {
//     return '';
//   }
//   if (size < 10) {
//     return `marker-${size}`;
//   }
//   if (size < 100) {
//     return `marker-${Math.floor(size / 10)}0`;
//   }
//   return 'marker-100';
// }

function getIconSize(size) {
  return Math.min(100, size) / 100 + 1;
}

function createSVGIcon(size) {

  if (size === 1) {
    return `
  <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <g>
      <title>Layer 1</title>
      <ellipse fill="#5165ff" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>             

    </g>
 </svg>`;
  }

  if (size < 50) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <g>
      <title>Layer 2</title>
      <ellipse fill="#5165ff" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
      <text fill="#ffffff" stroke-width="0" x="86" y="157" id="svg_1" font-size="24" font-family="Inter" 
      text-anchor="start" xml:space="preserve" stroke="null" transform="matrix(3.70743 0 0 3.83171 -226.608 -411.248)">10+</text>
      </g>
       

    </g>
 </svg>`;
  }

  if (size < 100) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <g>
      <title>Layer 3</title>
      <ellipse fill="#5165ff" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
      <text fill="#ffffff" stroke-width="0" x="86" y="158" id="svg_1" font-size="24" font-family="Inter"
      text-anchor="start" xml:space="preserve" stroke="null" transform="matrix(3.70743 0 0 3.83171 -226.608 -411.248)">100</text>    

    </g>
 </svg>`;
  }

  if (size < 1000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <g>
      <title>Layer 4</title>
      <ellipse fill="#5165ff" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
      <text fill="#ffffff" stroke-width="0" x="86" y="158" id="svg_1" font-size="24" font-family="Inter" 
      text-anchor="start" xml:space="preserve" stroke="null" transform="matrix(3.70743 0 0 3.83171 -226.608 -411.248)">1K</text>     

    </g>
 </svg>`;
  }
  if (size < 10000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <g>
      <title>Layer 5</title>
      <ellipse fill="#5165ff" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
      <text fill="#ffffff" stroke-width="0" x="82" y="158" id="svg_1" font-size="24" font-family="Inter" text-anchor="start" xml:space="preserve" stroke="null" 
      transform="matrix(3.70743 0 0 3.83171 -226.608 -411.248)">10K</text>                

    </g>
 </svg>`;

  }
  if (size < 100000) {
    return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <g>
      <title>Layer 6</title>
      <ellipse fill="#5165ff" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
      <text fill="#ffffff" stroke-width="0" x="73" y="158" id="svg_1" font-size="24" font-family="Inter" text-anchor="start" xml:space="preserve" stroke="null" 
      transform="matrix(3.70743 0 0 3.83171 -226.608 -411.248)">100K</text>                

    </g>
 </svg>`;

  }
  return `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
  <g>
    <title>Layer 7</title>
    <ellipse fill="#5165ff" stroke-width="0" cx="150" cy="150" id="svg_4" rx="130.54834" ry="130.54834"/>
    <text fill="#ffffff" stroke-width="0" x="73" y="158" id="svg_1" font-size="22" font-family="Inter" text-anchor="start" xml:space="preserve" stroke="null" 
    transform="matrix(3.70743 0 0 3.83171 -226.608 -411.248)">100K+</text>         
 
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
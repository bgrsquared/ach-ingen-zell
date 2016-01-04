import React from 'react';
import d3_scale from 'd3-scale';
const colorScale = d3_scale.viridis();

export default class Map extends React.Component {
  render() {
    const { data } = this.props;
    const { tiles, suffix, maxPercent, grandTotal } = data;

    colorScale.domain([maxPercent, 0]);

    let dots = [];
    for (let tile in tiles) {
      const t = tiles[tile];
      const col = colorScale(t.percentage);
      dots.push(<circle key={t.id} cx={t.x} cy={t.y} r="2.5" style={{"fill": col}}/>);
      // dots.add(<rect x={t.x} y={t.y} height={4} width={4} style={{'fill': col}}/>);
    }

    return (
      <div className="map-tile">
        <h2>-{suffix[0]}</h2>
        <h4>{suffix.slice(1).map((x)=>"-" + x).join(", ")}</h4>
        <h3>{grandTotal} places</h3>
        <svg width="200" height="300">
          {dots}
        </svg>
      </div>
    );
  }
}

export default Map;
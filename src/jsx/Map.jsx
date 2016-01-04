import React from 'react';
import d3_scale from 'd3-scale';
const colorScale = d3_scale.viridis();

export default class Map extends React.Component {
  render() {
    const { suffix } = this.props;
    let percentages = {};
    let maxPercent = 0;
    let totalCount = 0;

    const myRegexp = new RegExp(suffix.join('$|') + '$');
    const filterFunction = str => str.match(myRegexp);

    this.props.data.forEach((x)=> {
      let count = 0;
      count = x.names
        .filter(filterFunction)
        .length;
      totalCount += count;
      percentages[x.id] = count / x.length;
      if (x.length > 20) maxPercent = Math.max(maxPercent, percentages[x.id]);
    });

    colorScale.domain([maxPercent, 0]);

    let dots = this.props.data.map((x)=> {
      let col = colorScale(percentages[x.id]);
      return <circle key={x.id} cx={x.x} cy={x.y} r="2.5" style={{"fill": col}}/>;
    });

    return (
      <div className="map-tile">
        <h2>-{this.props.suffix[0]}</h2>
        <h4>{this.props.suffix.slice(1).map((x)=>"-" + x).join(", ")}</h4>
        <h3>{totalCount} places</h3>
        <svg width="200" height="300">
          {dots}
        </svg>
      </div>
    );
  }
}

export default Map;
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import d3_request from 'd3-request';
import d3_geo from 'd3-geo';
import d3_hexbin from 'd3-hexbin';

import App from 'App';
import suffixList from 'SuffixList';

require("../sass/main.sass");

const projection = d3_geo.geo
  .mercator()
  .center([13.4, 52.5])
  .translate([160, 120])
  .scale(1200)
  ;

const hexbin = d3_hexbin.hexbin()
  .x((d)=>d.x)
  .y((d)=>d.y)
  .size([200, 400])
  .radius(3);

d3_request.csv("data/placenames_de.tsv", (d)=> {
  d.forEach((x)=> {
    x.label = x.name;
    [x.x, x.y] = projection([+x.longitude, +x.latitude]);
  });

  let hbData = hexbin(d);
  const hbDataTerse = [];
  hbData.forEach((x)=> {
    hbDataTerse.push({
      id: `${x.i}/${x.j}`,
      names: x.map(town => town.name),
      length: x.length,
      x: x.x,
      y: x.y
    });
  });

  suffixList.sort((a, b)=> {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  });

  ReactDOM.render(
    <App suffixList={suffixList} data={hbDataTerse}/>,
    document.getElementById('app')
  );
});
import React from 'react';
import ReactDOM from 'react-dom';

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

  const hbDataFull = hexbin(d);
  const hbDataFullTerse = {};
  const fullLengthMap = new Map();

  hbDataFull.forEach((x)=> {
    fullLengthMap.set(`${x.i}/${x.j}`, x.length);
    hbDataFullTerse[`${x.i}/${x.j}`] = ({
      id: `${x.i}/${x.j}`,
      names: [], // x.map(town => town.name),
      length: 0, // x.length,
      fullLength: x.length,
      percentage: 0,
      x: x.x,
      y: x.y
    });
  });

  suffixList.sort((a, b)=> {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  });

  const readyData = [];
  suffixList.map(sfx => {
    let grandTotal = 0;
    const myRegexp = new RegExp(sfx.join('$|') + '$');
    const filterFunction = str => str.name.match(myRegexp);
    let maxPercent = 0;

    const hbData = hexbin(d.filter(filterFunction));
    const hbDataTerse = {};
    hbData.forEach((x)=> {
      const fullLength = fullLengthMap.get(`${x.i}/${x.j}`);
      const percentage = x.length / fullLength;
      if (fullLength > 20) {
        maxPercent = Math.max(maxPercent, percentage);
      }
      grandTotal += x.length;
      hbDataTerse[`${x.i}/${x.j}`] = ({
        id: `${x.i}/${x.j}`,
        names: x.map(town => town.name),
        length: x.length,
        fullLength: fullLength,
        percentage,
        x: x.x,
        y: x.y
      });
    });

    readyData.push({
      suffix: sfx,
      maxPercent,
      grandTotal,
      tiles: Object.assign(
        {},
        hbDataFullTerse,
        hbDataTerse)
    });
  });

  ReactDOM.render(
    <App data={readyData}/>,
    document.getElementById('app')
  );
})
;
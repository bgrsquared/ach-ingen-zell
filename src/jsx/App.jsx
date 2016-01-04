import React from 'react';
import Map from 'Map';

export default class App extends React.Component {
  render() {
    const { data } = this.props;

    const maps = data.map((d, i) => {
        return <Map
          key={'map' + i}
          data={d}
        />
      }
    );

    return <div>
      {maps}
    </div>
  }
}

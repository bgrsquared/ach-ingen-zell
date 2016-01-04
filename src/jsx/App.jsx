import React from 'react';
import Map from 'Map';

export default class App extends React.Component {
  render() {
    const { data } = this.props;

    const maps = this.props.suffixList.map((suffix)=> {
        return <Map
          key={suffix}
          data={this.props.data}
          suffix={suffix}
        />
      }
    );

    return <div>
      {maps}
    </div>
  }
}

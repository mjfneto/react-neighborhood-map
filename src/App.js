import React, {Component} from 'react'
import GoogleMapReact from 'google-map-react'

import './App.css'

const shibuya = { lat: 35.661971, lng: 139.703795 }

class App extends Component {

  handleApiLoaded = (...mapInfo) => {
    console.log(mapInfo)
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyC4WiMdI2XbkgZuTv11QgZvg8DtFS2vj9U' }}
          defaultCenter={shibuya}
          defaultZoom={14}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        />
      </div>
    );
  }
}

export default App

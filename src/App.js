import React, {Component} from 'react'
import GoogleMapReact from 'google-map-react'
import './App.css'

const shibuya = { lat: 35.661971, lng: 139.703795 }

class App extends Component {

  state = {
    locationSelected: {},
    locations: [
      {
        id: '1',
        name: 'Ōta Memorial Museum of Art',
        position: { lat: 35.669411, lng: 139.704908 }
      },
      {
        id: '2',
        name: 'Cat Street',
        position: { lat: 35.667512, lng: 139.706008}
      }
    ]
  }

  showMarker = l => {
    const marker = this.markers.filter(m => m.id === l.id)[0]
    this.infowindow.setContent(l.name)
    this.infowindow.open(this.map, marker)
    this.setState({
      locationSelected: l
    })
  }

  handleApiLoaded = (map, maps) => {
    this.google = {}
    this.google.maps = maps
    this.map = map

    this.markers = []

    this.infowindow = new this.google.maps.InfoWindow({})

    this.infowindow.addListener('closeclick', () => {
      this.setState({
        locationSelected: {}
      })
    })

    for(let i = 0; i < this.state.locations.length; i++) {
      let marker = new this.google.maps.Marker({
        position: this.state.locations[i].position,
        map: this.map,
        id: this.state.locations[i].id
      })

      this.markers.push(marker)

      marker.addListener('click', () => {
        this.infowindow.setContent(this.state.locations[i].name)
        this.infowindow.open(this.map, marker)
        this.setState({
          locationSelected: this.state.locations[i]
        })
      })
    }
  }

  render() {

    return (
      <div className='wrapper'>
        <div className='sidebar'>
          <ul class="list-group">
            {
              this.state.locations.map(l => (
                <li
                  key={l.id}
                  className='list-group-item'
                  onClick = {() => this.showMarker(l)}
                  type='button'
                  style={this.state.locationSelected.id === l.id ? {color: 'red'} : {color: 'blue'}}
                >
                    {l.name}
                </li>
              )
            )}
          </ul>
        </div>
        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyC4WiMdI2XbkgZuTv11QgZvg8DtFS2vj9U' }}
            defaultCenter={shibuya}
            defaultZoom={14}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
          />
        </div>
      </div>
    );
  }
}

export default App

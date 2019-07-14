import React, {Component} from 'react'
import {onMapLoaded} from './utils'
import './App.css'

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

  componentDidMount () {
    onMapLoaded()
      .then(google => {
        const shibuya = { lat: 35.661971, lng: 139.703795 }
        this.google = google;
        this.map = new google.maps.Map(
          document.getElementById('map'),
          {
            center: shibuya,
            zoom: 14
          }
        )
      })
  }

  render() {
    return (
      <div className='wrapper'>
        <div className='sidebar'>
          <ul className="list-group">
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
        <div id='map' style={{ height: '100vh', width: '100%' }}></div>
      </div>
    );
  }
}

export default App

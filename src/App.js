import React, {Component} from 'react'
import {onMapLoaded, onPlacesLoaded, onPlaceDetailsLoaded} from './utils'
import './App.css'

class App extends Component {

  state = {
    locationSelected: {},
    locations: []
  }

  showMarker = l => {
    const marker = this.markers.filter(m => m.id === l.id)[0]
    this.infowindow.setContent(marker.infowindowContent)
    this.infowindow.open(this.map, marker)
    this.setState({
      locationSelected: l
    })
  }

  componentDidMount () {
    const shibuya = { lat: 35.661971, lng: 139.703795 }
    const getMap = onMapLoaded()
    const getPlaces = onPlacesLoaded(shibuya)
    Promise.all([getMap, getPlaces])
      .then(data => {
        const venues = data[1].venues
        this.google = data[0]
        this.map = new this.google.maps.Map(
          document.getElementById('map'),
          {
            center: shibuya,
            zoom: 14
          }
        )

        this.infowindow = new this.google.maps.InfoWindow()

        console.log(venues)

        let markers = []

        venues.forEach(venue => {
          let marker = new this.google.maps.Marker({
            position: {lat: venue.location.lat, lng: venue.location.lng},
            map: this.map
          })

          marker.id = venue.id
          marker.infowindowContent = `
            <div>
              <p>${venue.name}</p>
            </div>
          `

          marker.addListener('click', () => {
            this.infowindow.setContent(marker.infowindowContent)
            this.infowindow.open(this.map, marker)
            this.setState({
              locationSelected: venue
            })
          })

          markers.push(marker)
        })

        this.markers = markers

        this.infowindow.addListener('closeclick', () => {
          this.setState({
            locationSelected: {}
          })
        })

        this.setState({
          locations: venues
        })
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

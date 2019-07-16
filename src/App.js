import React, {Component} from 'react'
import Sidebar from './components/Sidebar'
import {onMapLoaded, onPlacesLoaded, onPlaceDetailsLoaded} from './utils'
import './App.css'


class App extends Component {

  state = {
    selectedLocation: {},
    locations: []
  }

  showMarker = l => {
    const marker = this.markers.filter(m => m.id === l.id)[0]
    this.infowindow.setContent(marker.infowindowContent)
    this.infowindow.open(this.map, marker)
    this.setState({
      selectedLocation: l
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
              selectedLocation: venue
            })
          })

          markers.push(marker)
        })

        this.markers = markers

        this.infowindow.addListener('closeclick', () => {
          this.setState({
            selectedLocation: {}
          })
        })

        this.setState({
          locations: venues
        })
      })
  }

  render() {

    const { selectedLocation, locations } = this.state

    return (
      <div className='wrapper'>
        <Sidebar
          selectedLocation={selectedLocation}
          locations={locations}
          showMarker={this.showMarker}
        />
        <div id='map' style={{ height: '100vh', width: '100%' }}></div>
      </div>
    );
  }
}

export default App

import React, {Component} from 'react'
import _ from 'lodash'
import Sidebar from './components/Sidebar'
import {filterList, onMapLoaded, onPlacesLoaded, onPlaceDetailsLoaded} from './utils'
import './App.css'


class App extends Component {

  state = {
    selectedLocation: {},
    locations: [],
    visibleMarkers: []
  }

  showMarker = l => {
    const marker = this.markers.filter(m => m.id === l.id)[0]
    this.infowindow.setContent(marker.infowindowContent)
    this.infowindow.open(this.map, marker)
    this.setState({
      selectedLocation: l
    })
  }

  handleInputChange = query => {
    let visibleMarkers
    if (query) {
      visibleMarkers = filterList(query, this.markers)
      const invisibleMarkers = _.differenceBy(this.markers, visibleMarkers, 'id')
      invisibleMarkers.forEach(im => im.setVisible(false))
    } else {
      this.markers.forEach(m => m.setVisible(true))
      visibleMarkers = this.markers
    }

    this.setState({
      visibleMarkers
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
          marker.title = venue.name
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

        this.setState(({
          locations: venues,
          visibleMarkers: markers
        }))
      })
  }

  render() {

    const { selectedLocation, locations, visibleMarkers } = this.state

    return (
      <div className='wrapper'>
        <Sidebar
          selectedLocation={selectedLocation}
          visibleMarkers={visibleMarkers}
          showMarker={this.showMarker}
          onInputChange={this.handleInputChange}
        />
        <div id='map' style={{ height: '100vh', width: '100%' }}></div>
      </div>
    );
  }
}

export default App

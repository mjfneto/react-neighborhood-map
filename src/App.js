import React, {Component} from 'react'
import _ from 'lodash'
import removeAccents from 'remove-accents'
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

    const { selectedLocation } = this.state

    const marker = this.markers.filter(m => m.id === l.id)[0]
    this.distinguishById(l.id !== selectedLocation.id ? marker : false)
    this.setState({
      selectedLocation: l.id !== selectedLocation.id ? l : {}
    })
  }

  handleInputChange = query => {

    const { selectedLocation } = this.state
    let visibleMarkers

    if (query) {

      visibleMarkers = filterList(removeAccents(query), this.markers);
      (!_.includes(visibleMarkers, vm => vm.id === selectedLocation.id) && this.infowindow.close())

      const invisibleMarkers = _.differenceBy(this.markers, visibleMarkers, 'id')

      visibleMarkers.forEach(vm => {
        (vm.id === selectedLocation.id && this.distinguishById(vm))
        vm.setVisible(true)
        vm.setAnimation(this.google.maps.Animation.BOUNCE)
        setTimeout(() => {vm.setAnimation(null)}, 500)
      })

      invisibleMarkers.forEach(im => im.setVisible(false))

    } else {
      this.markers.forEach(m => {
        if (m.id === selectedLocation.id) {
          this.distinguishById(m)
          return
        }
        m.setVisible(true)
        m.setOpacity(1.0)
        m.setAnimation(this.google.maps.Animation.DROP)
      })
      visibleMarkers = this.markers
    }

    this.setState(({
      visibleMarkers
    }))
  }

  distinguishById = (marker) => {

    const { selectedLocation } = this.state;

    (marker && (() => {
      this.markers.forEach(em => {
        (em.id !== marker.id && (() => {
          em.setOpacity(0.4)
          em.setAnimation(null)
        })())

        marker.setVisible(true)
        marker.setOpacity(1.0)
        marker.setZIndex(1000);
        (marker.id !== selectedLocation.id && marker.setAnimation(this.google.maps.Animation.BOUNCE))
        setTimeout(() => { marker.setAnimation(null) }, 500)
      })

      this.infowindow.setContent(marker.infowindowContent)
      this.infowindow.open(this.map, marker)
    })());

    (!marker && this.markers.forEach(m => {
      m.setOpacity(1.0)
      this.infowindow.close()
    }))
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

        this.map.addListener('click', () => {
          this.distinguishById(false)
          this.infowindow.close()
          this.setState({
            selectedLocation: {}
          })
        })

        this.infowindow = new this.google.maps.InfoWindow()
        this.infowindow.addListener('closeclick', () => {
          this.distinguishById(false)
          this.setState({
            selectedLocation: {}
          })
        })

        console.log(venues)

        let markers = []

        venues.forEach(venue => {
          let marker = new this.google.maps.Marker({
            position: {lat: venue.location.lat, lng: venue.location.lng},
            map: this.map,
            opacity: 1.0,
            animation: this.google.maps.Animation.DROP
          })

          marker.id = venue.id
          marker.title = venue.name
          marker.infowindowContent = `
            <div>
              <p>${venue.name}</p>
            </div>
          `

          marker.addListener('click', () => {
            this.distinguishById(marker)
            this.setState({
              selectedLocation: venue
            })
          })

          markers.push(marker)
        })

        this.markers = markers

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

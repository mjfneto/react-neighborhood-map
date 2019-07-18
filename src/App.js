import React, {Component} from 'react'
import _ from 'lodash'
import removeAccents from 'remove-accents'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import {filterList, onMapLoaded, onPlacesLoaded} from './utils'
import './App.css'

class App extends Component {

  state = {
    harlem: { lat: 40.81955, lng: -73.946477 },
    selectedLocation: {},
    visibleMarkers: [],
    sidebar: true
  }

  toggleSidebar = () => {
    this.setState(state => ({
      sidebar: state.sidebar ? false : true
    }))
  }

  showMarker = (marker) => this.google.maps.event.trigger(marker, 'click')

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
    if (marker) {
      this.markers.forEach(em => {
        (em.id !== marker.id && (() => {
          em.setOpacity(0.4)
        })())})

      marker.setVisible(true)
      marker.setOpacity(1.0)
      marker.setZIndex(1000)
      const position = marker.getPosition()
      this.map.panTo(position)

      setTimeout(() => {
        this.infowindow.setContent(marker.infowindowContent)
        this.infowindow.open(this.map, marker)
      }, 500)

      this.setState({
        selectedLocation: marker
      })
    } else {
      this.infowindow.close()
      this.map.setZoom(14);
      this.markers.forEach(m => {
        m.setOpacity(1.0)
      })
      this.map.panTo(this.state.harlem)
      this.setState({
        selectedLocation: {}
      })
    }
  }

  componentDidMount () {
    const getMap = onMapLoaded()
    const getPlaces = onPlacesLoaded(this.state.harlem)
    Promise.all([getMap, getPlaces])
      .then(data => {
        const venues = data[1].venues
        this.google = data[0]
        this.map = new this.google.maps.Map(
          document.getElementById('map'),
          {
            center: this.state.harlem,
            zoom: 14
          }
        )

        this.map.addListener('click', () => {
          (this.map.getZoom() === 16 && this.distinguishById(false))
        })

        this.infowindow = new this.google.maps.InfoWindow()
        this.infowindow.addListener('closeclick', () => {
          this.distinguishById(false)
        })

        let markers = []

        console.log(venues)

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
            (this.map.getZoom() === 14 && this.map.setZoom(16));
            marker.id === this.state.selectedLocation.id ? this.distinguishById(false) : this.distinguishById(marker)
          })

          markers.push(marker)
        })

        this.markers = markers

        this.setState(({
          visibleMarkers: markers
        }))
      })
  }

  render() {

    const {
      selectedLocation,
      visibleMarkers,
      sidebar
    } = this.state

    return (
      <div className='wrapper'>
        <Sidebar
          selectedLocation={selectedLocation}
          visibleMarkers={visibleMarkers}
          showMarker={this.showMarker}
          onInputChange={this.handleInputChange}
          sidebar={sidebar}
        />
        <div className="content">
          <Navbar
            sidebar={sidebar}
            toggleSidebar={this.toggleSidebar} />
          <div id='map'></div>
        </div>
      </div>
    );
  }
}

export default App

import React, {Component} from 'react'
import _ from 'lodash'
import removeAccents from 'remove-accents'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import {filterList, onMapLoaded, onPlacesLoaded, onStaticPanoLoaded} from './utils'
import './App.css'

class App extends Component {

  state = {
    harlem: { lat: 40.81955, lng: -73.946477 },
    centralPark: { lat: 40.782493, lng: -73.965424},
    selectedLocation: {},
    visibleMarkers: [],
    sidebar: false
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
        this.infowindow.setContent(marker.infowindowContent.success)
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
      this.map.panTo(this.state.centralPark)
      this.setState({
        selectedLocation: {}
      })
    }
  }

  componentDidMount () {
    const getMap = onMapLoaded()
    const getPlaces = onPlacesLoaded(this.state.centralPark)
    Promise.all([getMap, getPlaces])
      .then(data => {
        this.google = data[0]
        const venues = data[1].venues
        this.map = new this.google.maps.Map(
          document.getElementById('map'),
          {
            center: this.state.centralPark,
            zoom: 14,
            streetViewControl: false
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
            title: venue.name,
            opacity: 1.0,
            animation: this.google.maps.Animation.DROP
          })

          const joinedCategories = (venue) => {
            const joined = []
            venue.categories.forEach(c => {
              joined.push(c.name)
            })
            return joined.join(', ')
          }

          marker.id = venue.id
          marker.infowindowContent = {
            success: `
              <div class="card" style="width: 18rem;">
                <img src="${onStaticPanoLoaded(venue.location)}" class="card-img-top" alt="${venue.name}">
                <div class="card-body">
                  <h5 class="card-title">${venue.name}</h5>
                  <p class="card-text">${joinedCategories(venue)}</p>
                  <a href="#" class="btn btn-primary">Info</a>
                </div>
              </div>
            `,
            failure: '<div><p>' + venue.name + '</p><div>No panorama available</div></div>'
          }

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

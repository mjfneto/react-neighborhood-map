import React, {Component} from 'react'
import _ from 'lodash'
import removeAccents from 'remove-accents'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import VenuesList from './components/VenuesList'
import ErrorNotification from './components/ErrorNotification'
import {filterList, onMapLoaded, onPlacesLoaded, onStaticPanoLoaded} from './utils'
import './App.css'

class App extends Component {

  state = {
    centralPark: { lat: 40.782493, lng: -73.965424},
    selectedLocation: {},
    visibleMarkers: [],
    venues: [],
    sidebar: true,
    error: {
      value: false,
      source: ''
    }
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

  joinCategories = (venue) => {
    const joined = []
    venue.categories.forEach(c => {
      joined.push(c.name)
    })
    return joined.join(', ')
  }

  componentDidMount () {
    const getMap = onMapLoaded()
    const getPlaces = onPlacesLoaded(this.state.centralPark)
    Promise.all([getMap, getPlaces].map(p => p.catch(() => undefined)))
      .then(data => {
        if (data[1] && !localStorage.getItem('venues')) {
          localStorage.setItem('venues', JSON.stringify(data[1].venues))
        }

        if (data[0]) {
          this.google = data[0]
          this.map = new this.google.maps.Map(
            document.getElementById('map'),
            {
              center: this.state.centralPark,
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

          if (localStorage.getItem('venues')) {
            const venues = JSON.parse(localStorage.getItem('venues'))
            let markers = []

            venues.forEach(venue => {
              let marker = new this.google.maps.Marker({
                position: { lat: venue.location.lat, lng: venue.location.lng },
                map: this.map,
                title: venue.name,
                opacity: 1.0,
                animation: this.google.maps.Animation.DROP
              })

              marker.id = venue.id
              marker.categories = this.joinCategories(venue)
              marker.infowindowContent = {
                success: `
            <div class="card" style="width: 18rem;">
              <img src="${onStaticPanoLoaded(venue.location)}" class="card-img-top" alt="${marker.title}">
              <div class="card-body">
                <h5 class="card-title">${marker.title}</h5>
                <p class="card-text">${marker.categories}</p>
                <a href="#" class="btn btn-primary">Info</a>
              </div>
            </div>
          `
              }

              marker.addListener('click', () => {
                (this.map.getZoom() === 14 && this.map.setZoom(16));
                marker.id === this.state.selectedLocation.id ? this.distinguishById(false) : this.distinguishById(marker)
              })

              markers.push(marker)
            })

            this.markers = markers

            this.setState(({
              visibleMarkers: markers,
              error: {
                value: false,
                source: ''
              }
            }))
          } else {
            this.setState({
              error: {
                value: true,
                source: 'places'
              }
            })
          }
        } else {
          if (localStorage.getItem('venues')) {
            this.setState({
              venues: JSON.parse(localStorage.getItem('venues')),
              error: {
                value: true,
                source: 'map'
              }
            })
          } else {
            this.setState({
              error: {
                value: true,
                source: 'all'
              }
            })
          }
        }
      })
  }

  render() {

    const {
      selectedLocation,
      visibleMarkers,
      venues,
      sidebar,
      error
    } = this.state

    return (
      <div>
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
            <div id={!error.value ? 'map' : 'venues-list'} title='Cultural places in Central Park area'>
              {(error.source === 'map' &&
                <VenuesList venues={venues} joinCategories={this.joinCategories} />)}
            </div>
          </div>
        </div>
        {(error.value && <ErrorNotification source={error.source} />)}
      </div>
    );
  }
}

export default App

export function onMapLoaded () {
    return new Promise(resolve => {
        window.handleMapPromise = function () {
            resolve(window.google)
            delete window.handleMapPromise
        }
        const src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4WiMdI2XbkgZuTv11QgZvg8DtFS2vj9U&libraries=places&callback=handleMapPromise'
        const script = document.createElement('script')
        script.src = src
        document.body.insertAdjacentElement('beforeend', script)
    })
}

export function onPlacesLoaded () {
    return fetch('https://api.foursquare.com/v2/venues/search?client_id=O5SPZBP1YE0DP5IRPQD3UUDKQNJIJNIXA0X0VGLI1EPEB1Z0&client_secret=GQ3VSSRGVRGERR2M1P2LKZSNHLJQ30TIPASZM4QMVY5VXVTK&v=20180323&limit=5&ll=35.661971,139.703795&radius=2000&query=museum')
    .then(response => response.json())
    .then(json => json.response)
}
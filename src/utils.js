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
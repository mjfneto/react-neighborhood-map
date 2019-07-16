export function onMapLoaded () {
    return new Promise(resolve => {
        window.handleMapPromise = function () {
            resolve(window.google)
            delete window.handleMapPromise
        }
        const key = 'AIzaSyC4WiMdI2XbkgZuTv11QgZvg8DtFS2vj9U'
        const src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=handleMapPromise`
        const script = document.createElement('script')
        script.src = src
        document.body.insertAdjacentElement('beforeend', script)
    })
}

export function onPlacesLoaded (center) {
    const limit = '25'
    const radius = '2000'
    const query = 'museum'
    return fetch(`https://api.foursquare.com/v2/venues/search?client_id=O5SPZBP1YE0DP5IRPQD3UUDKQNJIJNIXA0X0VGLI1EPEB1Z0&client_secret=GQ3VSSRGVRGERR2M1P2LKZSNHLJQ30TIPASZM4QMVY5VXVTK&v=20180323&limit=${limit}&ll=${center.lat},${center.lng}&radius=${radius}&query=${query}`)
        .then(response => response.json())
        .then(json => json.response)
}

export function onPlaceDetailsLoaded (id) {
    return fetch(`https://api.foursquare.com/v2/venues/${id}?client_id=O5SPZBP1YE0DP5IRPQD3UUDKQNJIJNIXA0X0VGLI1EPEB1Z0&client_secret=GQ3VSSRGVRGERR2M1P2LKZSNHLJQ30TIPASZM4QMVY5VXVTK&v=20180323`)
        .then(response => response.json())
        .then(json => json.response)
}

/**
  * A big thanks to Peter (https://twitter.com/peterbe) for publishing this function.
  * It is complemented by replacements of non-romanic characters between parenthesis
  * from the item's title.
  *
  * Available at: https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
  */
export function filterList (q, list) {
    function escapeRegExp(s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    const words = q
        .split(/\s+/g)
        .map(s => s.trim())
        .filter(s => !!s);
    const hasTrailingSpace = q.endsWith(" ");
    const searchRegex = new RegExp(
        words
            .map((word, i) => {
                if (i + 1 === words.length && !hasTrailingSpace) {
                    // The last word - ok with the word being "startswith"-like
                    return `(?=.*\\b${escapeRegExp(word)})`;
                } else {
                    // Not the last word - expect the whole word exactly
                    return `(?=.*\\b${escapeRegExp(word)}\\b)`;
                }
            })
            .join("") + ".+",
        "gi"
    );
    return list.filter(item => {
        return searchRegex.test(item.title.replace(/\s\([\W\w] +\)$/gi, ''));
    });
}
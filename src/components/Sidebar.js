import React from 'react'
import '../App.css'

const Sidebar = ({selectedLocation, locations, showMarker}) => {
    return (
        <div className='sidebar'>
            <ul className="list-group">
                {
                    locations.map(l => (
                        <li
                            key={l.id}
                            className='list-group-item'
                            onClick={() => showMarker(l)}
                            type='button'
                            style={selectedLocation.id === l.id ? { color: 'red' } : { color: 'blue' }}
                        >
                            {l.name}
                        </li>
                    )
                    )}
            </ul>
        </div>
    )
}

export default Sidebar
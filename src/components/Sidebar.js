import React from 'react'
import '../App.css'

const Sidebar = ({
    selectedLocation,
    visibleMarkers,
    showMarker,
    onInputChange }) => {

        return (
            <nav className='sidebar'>
                <div className='p-3'>
                    <h1>Arts & Culture in Shibuya</h1>
                </div>
                <div className="mb-4 p-3 input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder='Search...'
                        aria-label="Text input with dropdown button"
                        onChange={(e) => onInputChange(e.target.value)}
                    ></input>
                    <div className="input-group-append">
                        <button
                            className="btn btn-info dropdown-toggle"
                            type="button"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            Filter
                        </button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item" type='button'>Action</button>
                            <button className="dropdown-item" type='button'>Another action</button>
                            <button className="dropdown-item" type='button'>Something else here</button>
                            <div role="separator" className="dropdown-divider"></div>
                            <button className="dropdown-item" type='button'>Separated link</button>
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <ul className="list-group">
                        {
                            visibleMarkers.map(vm => (
                                <li
                                    key={vm.id}
                                    className='list-group-item'
                                    onClick={() => showMarker(vm)}
                                    type='button'
                                    style={selectedLocation.id === vm.id ? { color: 'red' } : { color: 'blue' }}
                                >
                                    {vm.title}
                                </li>
                            )
                            )}
                    </ul>
                </div>
            </nav>
        )
}

export default Sidebar
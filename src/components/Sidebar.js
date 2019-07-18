import React, {Component} from 'react'
import '../App.css'

class Sidebar extends Component {

    state = {
        dropdown: false
    }

    showDropdown = () => {
        this.setState(state => ({
            dropdown: state.dropdown ? false : true
        }))
    }

    render() {

        const { dropdown } = this.state
        const {
            selectedLocation,
            visibleMarkers,
            showMarker,
            onInputChange,
            sidebar
        } = this.props

        return (
            <nav className={sidebar ? 'sidebar' : 'sidebar hide'}>
                <div className='p-3'>
                    <h1>Jazz in Harlem</h1>
                </div>
                <div className="p-3 input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder='Search...'
                        aria-label="Text input with dropdown button"
                        onChange={(e) => onInputChange(e.target.value)}
                    ></input>
                    <div className="input-group-append">
                        <div className="btn-group dropright">
                            <button
                                className="btn btn-info dropdown-toggle"
                                type="button"
                                aria-haspopup="true"
                                aria-expanded="false"
                                onClick={this.showDropdown}
                            >
                                Filter
                            </button>
                        </div>
                        <div className={dropdown ? "dropdown-menu show" : "dropdown-menu"}>
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
                                    style={vm.id === selectedLocation.id ? { color: 'red'} : { color: 'blue' }}
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
}

export default Sidebar
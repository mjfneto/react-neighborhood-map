import React, {Component} from 'react'
import ListItem from './ListItem'
import '../App.css'

class Sidebar extends Component {

    state = {
        focusOnList: false,
        listFocusIndex: 0
    }

    searchInput = React.createRef()
    listItem = React.createRef()

    handleFocusOnList = focusOnList => {
        this.setState({
            focusOnList
        })
    }

    increaseListFocusIndex = () => {
        this.setState(state => ({
            listFocusIndex: state.listFocusIndex + 1
        }))
    }

    decreaseListFocusIndex = () => {
        this.setState(state => ({
            listFocusIndex: state.listFocusIndex - 1
        }))
    }

    componentDidMount() {
        this.searchInput.current.focus()
    }

    componentDidUpdate(prevProps, prevState) {

        const { focusOnList, listFocusIndex } = this.state

        if (focusOnList === true || prevState.listFocusIndex !== listFocusIndex) {
            this.listItem.current.focus()
        } else {
            this.searchInput.current.focus()
        }
    }

    render() {
        const {
            listFocusIndex,
            focusOnList
        } = this.state

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
                    <h1>Arts & Culture near Central Park</h1>
                </div>
                <div className="p-3 input-group">
                    <label
                        className='w-100'
                        htmlFor='search-locations'
                    >
                        Type in a location's name:
                    </label>
                    <input
                        id='search-locations'
                        type="text"
                        className="form-control"
                        placeholder='Search...'
                        aria-label="Text input with dropdown button"
                        onChange={(e) => onInputChange(e.target.value)}
                        ref={this.searchInput}
                    ></input>
                </div>
                <div className='container'>
                    <span id='locations-label'>Locations:</span>
                    <ul
                        aria-labelledby='locations-label'
                        className="list-group"
                        role='listbox'
                        tabIndex={0}
                        onFocus={e => {
                            e.preventDefault()
                            if (focusOnList === false) {
                                this.handleFocusOnList(true)
                            }
                        }}
                    >
                        {
                            visibleMarkers.map((vm, index) => (
                                <ListItem
                                    key={vm.id}
                                    vm={vm}
                                    visibleMarkers={visibleMarkers}
                                    index={index}
                                    focusOnList={focusOnList}
                                    listFocusIndex={listFocusIndex}
                                    onFocusOnList={this.handleFocusOnList}
                                    increase={this.increaseListFocusIndex}
                                    decrease={this.decreaseListFocusIndex}
                                    selectedLocation={selectedLocation}
                                    listItemRef={this.listItem}
                                    showMarker={showMarker}
                                />
                            )
                            )}
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Sidebar
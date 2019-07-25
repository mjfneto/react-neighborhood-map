import React, {Component} from 'react'
import '../App.css'

class ListItem extends Component {
    render() {

        const {
            focusOnList,
            listFocusIndex,
            onFocusOnList,
            increase,
            decrease,
            index,
            vm,
            visibleMarkers,
            listItemRef,
            selectedLocation,
            showMarker
        } = this.props

        return (
            <li
                className='list-group-item'
                role='option'
                ref={index === listFocusIndex && listItemRef}
                tabIndex={index === listFocusIndex ? '0' : '-1'}
                aria-selected={vm.id === selectedLocation.id ? true : false}
                onClick={() => showMarker(vm)}
                onKeyDown={e => {
                    if (e.keyCode === 9) { // Tab
                        if (e.shiftKey && focusOnList) {
                            onFocusOnList(false)
                            e.preventDefault()
                        }
                    } else if (e.keyCode === 38 && index > 0) {
                        decrease()
                    }
                    else if (e.keyCode === 40 && index < visibleMarkers.length - 1) {
                        increase()
                    } else if (e.keyCode === 13 || e.keyCode === 32) {
                        showMarker(vm)
                        e.preventDefault()
                    }
                }}
                style={vm.id === selectedLocation.id ? { color: 'red' } : { color: 'blue' }}
            >
                {vm.title}
            </li>
        )
    }
}

export default ListItem
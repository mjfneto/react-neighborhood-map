import React from 'react'
import Card from './Card'
import '../App.css'

const VenuesList = ({ venues, joinCategories }) => {

    return (
        <div className="accordion" id='accordion'>
            {venues.map(v => {
                return (
                    <Card
                        key={v.id}
                        v={v}
                        joinCategories={joinCategories}
                    />
                )
            })}
        </div>
    )
}

export default VenuesList
import React from 'react'
import '../App'

const ErrorModal = props => {
    return (
        <div
            className="alert alert-dark border-0"
            role="alert"
            style={{
                width: 'auto',
                position: 'fixed',
                left: '2%',
                bottom: '2%',
                zIndex: '1000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'red',
                backgroundColor: '#3337'
            }}
        >
            Could not load the locations
            <button
                className="btn btn-link"
                type='button'
                style={{ fontWeight: '700', textTransform: 'uppercase'}}
                onClick={() => window.location.reload()}
            >
                Refresh
            </button>
        </div>
    )
}

export default ErrorModal
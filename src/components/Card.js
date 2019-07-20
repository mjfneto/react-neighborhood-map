import React, {Component} from 'react'
import '../App.css'

class Card extends Component {

    state = {
        collapse: false
    }

    handleCollapse = () => {
        this.setState(state => ({
            collapse: state.collapse ? false : true
        }))
    }

    render() {

        const { collapse } = this.state
        const { v, joinCategories } = this.props

        return (
            <div key={v.id} className="card">
                <div
                    className="card-header"
                    id={`heading${v.id}`}
                    style={
                        {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }
                    }
                >
                    <h2 className="mb-0">
                        <button
                            className="btn btn-link"
                            type="button"
                            aria-expanded="true"
                            aria-controls={`#collapse-${v.id}`}
                            onClick={this.handleCollapse}
                        >
                            {v.name}
                        </button>
                    </h2>
                    <span className="badge badge-primary badge-pill">{v.hereNow.count}</span>
                </div>

                <div id={v.id} className={collapse ? 'collapse show' : 'collapse'} aria-labelledby={`#heading${v.id}`} data-parent="#accordion">
                    <div className="card-body">
                        <h5 className="card-title">{v.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{joinCategories(v)}</h6>
                        <p className="card-text">{v.location.formattedAddress && v.location.formattedAddress.join(', ')}</p>
                        <small>{v.hereNow.summary}</small>
                    </div>
                </div>
            </div>
        )
    }
}

export default Card
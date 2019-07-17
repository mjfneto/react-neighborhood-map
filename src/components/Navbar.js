import React, {Component} from 'react'
import '../App.css'

class Navbar extends Component {
    state = {
        hamburgerMenu: false
    }

    switchToBurger = () => {
        this.setState(() => ({
            hamburgerMenu: window.innerWidth <= 567 ? true : false
        }))
    }

    componentDidMount() {
        window.addEventListener('resize', this.switchToBurger)
    }

    render() {

        const { hamburgerMenu } = this.state
        const { sidebar, toggleSidebar } = this.props

        return (
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <button
                    type='button'
                    className={hamburgerMenu ? 'btn btn-info btn-lg': 'btn btn-info'}
                    onClick={() => toggleSidebar()}
                >
                    <span>{hamburgerMenu ? '☰' : 'Toggle Sidebar'}</span>
                </button>
                <div className='p-3 nav-header'>
                    <h1>{sidebar ? 'Arts & Culture in Shibuya' : '渋谷区'}</h1>
                </div>
            </nav>
        )
    }
}

export default Navbar
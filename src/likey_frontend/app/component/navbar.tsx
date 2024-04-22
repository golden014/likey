import { faHandHoldingDollar, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Navbar = () => {
    return (
        <div className='h-fit_screen bg-background border-3 border-border_placeholder rounded-default w-navbar_width flex flex-col justify-between'>
            {/* Top Part */}
            <div className='w-full flex justify-center p-6 flex-col gap-4'>
                <div className='w-icon_width h-icon_height bg-border_placeholder flex justify-center items-center rounded-full'>
                    <FontAwesomeIcon icon={faHome} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className='w-icon_width h-icon_height bg-border_placeholder flex justify-center items-center rounded-full'>
                    <FontAwesomeIcon icon={faHome} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className='w-icon_width h-icon_height bg-border_placeholder flex justify-center items-center rounded-full'>
                    <FontAwesomeIcon icon={faHome} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className='w-icon_width h-icon_height bg-border_placeholder flex justify-center items-center rounded-full'>
                    <FontAwesomeIcon icon={faHome} className='w-3/5 h-3/5' color='white'/>
                </div>
            </div>
            {/* Bot Part */}
            <div className='w-full flex justify-center p-6 flex-col gap-4'>
                <div className='w-icon_width h-icon_height bg-border_placeholder flex justify-center items-center rounded-full'>
                    <FontAwesomeIcon icon={faHome} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className='w-icon_width h-icon_height bg-border_placeholder flex justify-center items-center rounded-full'>
                    <FontAwesomeIcon icon={faHome} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className='w-icon_width h-icon_height bg-border_placeholder flex justify-center items-center rounded-full'>
                    <FontAwesomeIcon icon={faHome} className='w-3/5 h-3/5' color='white'/>
                </div>
            </div>
        </div>
    )
}

export default Navbar

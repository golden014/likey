import { faComment, faCompass, faDollar, faGear, faHeart, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface Page{
    profile : string,
    explore : string,
    chat : string,
    interest : string,
    payment : string,
    setting : string
}

const Navbar = ({pageName, handleChange} : {pageName : string, handleChange : (pathName : string) => void}) => {

    const color : Page = {
        profile : pageName == "Profile" ? "bg-main" : "bg-background",
        explore : pageName == "Explore" ? "bg-main" : "bg-background",
        chat : pageName == "Chat" ? "bg-main" : "bg-background",
        interest : pageName == "Interest" ? "bg-main" : "bg-background",
        payment : pageName == "Payment" ? "bg-main" : "bg-background",
        setting : pageName == "Setting" ? "bg-main" : "bg-background",
    }

    const defaultTailwind = "w-icon_width h-icon_height bg-border_placeholder flex justify-center items-center rounded-full text-white hover:cursor-pointer"

    return (
        <div className='h-fit_screen bg-background border-3 border-border_placeholder rounded-default w-navbar_width flex flex-col justify-between'>
            {/* Top Part */}
            <div className='w-full flex items-center justify-center p-6 flex-col gap-4'>
                <div className={`${defaultTailwind} ${color.profile}`} onClick={() => {
                    handleChange("Profile")
                    }}>
                    <FontAwesomeIcon icon={faUser} className='w-3/5 h-3/5'/>
                </div>
                <div className={`${defaultTailwind} ${color.explore}`} onClick={() => {
                    handleChange("Explore")
                    }}>
                    <FontAwesomeIcon icon={faCompass} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className={`${defaultTailwind} ${color.chat}`} onClick={() => {
                    handleChange("Chat")
                    }}>
                    <FontAwesomeIcon icon={faComment} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className={`${defaultTailwind} ${color.interest}`} onClick={() => {
                    handleChange("Interest")
                    }}>
                    <FontAwesomeIcon icon={faHeart} className='w-3/5 h-3/5' color='white'/>
                </div>
            </div>
            {/* Bot Part */}
            <div className='w-full flex items-center justify-center p-6 flex-col gap-4'>
                <div className={`${defaultTailwind} ${color.payment}`} onClick={() => {
                    handleChange("Payment")
                    }}>
                    <FontAwesomeIcon icon={faDollar} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className={`${defaultTailwind} ${color.setting}`} onClick={() => {
                    handleChange("Setting")
                    }}>
                    <FontAwesomeIcon icon={faGear} className='w-3/5 h-3/5' color='white'/>
                </div>
                <div className={`${defaultTailwind}`}>
                    <FontAwesomeIcon icon={faRightFromBracket} className='w-3/5 h-3/5' color='white'/>
                </div>
            </div>
        </div>
    )
}

export default Navbar

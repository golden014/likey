import { faComment, faCompass, faDollar, faGear, faHeart, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

interface Page{
    profile : string,
    explore : string,
    chat : string,
    interest : string,
    payment : string,
    setting : string
}

const Navbar = ({pageName} : {pageName : string}) => {

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
                <Link href={"/user/profile"} className={`${defaultTailwind} ${color.profile}`}>
                    <FontAwesomeIcon icon={faUser} className='w-3/5 h-3/5'/>
                </Link>
                <Link href={"/explore"} className={`${defaultTailwind} ${color.explore}`}>
                    <FontAwesomeIcon icon={faCompass} className='w-3/5 h-3/5' color='white'/>
                </Link>
                <Link href={"/chat"} className={`${defaultTailwind} ${color.chat}`}>
                    <FontAwesomeIcon icon={faComment} className='w-3/5 h-3/5' color='white'/>
                </Link>
                <Link href={"/interested"} className={`${defaultTailwind} ${color.interest}`}>
                    <FontAwesomeIcon icon={faHeart} className='w-3/5 h-3/5' color='white'/>
                </Link>
            </div>
            {/* Bot Part */}
            <div className='w-full flex items-center justify-center p-6 flex-col gap-4'>
                <Link href={"/subscribe"} className={`${defaultTailwind} ${color.payment}`}>
                    <FontAwesomeIcon icon={faDollar} className='w-3/5 h-3/5' color='white'/>
                </Link>
                <Link href={"/user/login"} className={`${defaultTailwind}`}>
                    <FontAwesomeIcon icon={faRightFromBracket} className='w-3/5 h-3/5' color='white'/>
                </Link>
            </div>
        </div>
    )
}

export default Navbar

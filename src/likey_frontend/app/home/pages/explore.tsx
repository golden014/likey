import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React from 'react'

const ExplorePage = () => {
    return (
        <div className='w-full h-full flex'>
            {/* Picture and Interested Button */}
            <div className='w-3/5 h-full relative'>
                {/* Picture */}
                <div className='w-full h-full'>
                    <Image src="/profile_dummy.png" className='w-full h-full rounded-default border-3 border-border_placeholder shadow-2xl' height={500} width={500} alt='missing'/>
                </div>
                {/* Button */}
                <div className='absolute bottom-5 w-full flex justify-center h-interact_button_height'>
                    <div className='flex justify-between w-1/4 h-full'>
                        <button className='h-full border-3 border-background p-2 bg-background rounded-default'>
                            <FontAwesomeIcon icon={faHeart} color='red' className='h-full'/>
                        </button>
                        <button className='h-full border-3 border-background p-2 bg-background rounded-default'>
                            <FontAwesomeIcon icon={faHeartBroken} color='red' className='h-full'/>
                        </button>
                    </div>
                </div>
            </div>
            <div className='w-2/5'>
                fadwasd
            </div>
        </div>
    )
}

export default ExplorePage
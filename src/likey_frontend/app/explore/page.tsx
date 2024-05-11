"use client"
import React from 'react'
import Navbar from '../component/navbar';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faHeart, faHeartBroken, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DUMMY_PROFILE, HOBBIES } from '../dummy_data';
import { getUserDataFromStorage } from '../utility/userDataController';
import { dec } from '../utility/cryptController';
import { getCookie } from 'cookies-next';

const Page = async () => {
    const user = await getUserDataFromStorage()
    console.log(user)   

    let cook = await dec(getCookie("my_principal_id")||"")
    let afterParse = JSON.parse(cook||"{}")
    console.log(afterParse) 
    return (
      <div className='w-screen h-screen bg-background flex justify-around items-center'>
        
        <Navbar pageName="Explore"/>

        <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
            <div className='w-full h-full flex'>
                {/* Picture and Interested Button */}
                <div className='w-3/5 h-full relative'>
                    {/* Picture */}
                    <div className='w-full h-full'>
                        <Image src="/profile_dummy.png" className='w-full h-full rounded-default border border-border_placeholder shadow-2xl' height={1000} width={1000} alt='missing'/>
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
                {/* Profile */}
                <div className='w-2/5'>
                    {/* Fitler and remaining swipe */}
                    <div className='flex justify-around'>
                        <button className='bg-background flex justify-center border-3 border-border_placeholder p-2 rounded-default shadow-2xl w-photo_form_input'>
                            <FontAwesomeIcon icon={faFilter} className='h-4 aspect-square text-border_placeholder pt-1'/>
                            <div className='ml-1'>
                                Filter
                            </div>
                        </button>
                        <div className='bg-background border-3 border-border_placeholder p-2 rounded-default shadow-2xl w-photo_form_input flex justify-center'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='h-4 aspect-square text-border_placeholder pt-1'/>
                            <div className='ml-1'>
                                {DUMMY_PROFILE.current_swipe}
                            </div>
                        </div>
                    </div>

                    {/* Bio Data */}
                    <div className='p-6'>
                        <div className="text-title font-extrabold">
                            {DUMMY_PROFILE.first_name} {DUMMY_PROFILE.last_name}
                        </div>
                        <div className='text-girl text-content font-bold'>
                            {DUMMY_PROFILE.gender}
                        </div>
                        <div className='text-content font-bold'>
                            {DUMMY_PROFILE.height} cm / {DUMMY_PROFILE.religion}
                        </div>
                        <div className='text-content font-bold'>
                            {DUMMY_PROFILE.education}
                        </div>
                        <div className='text-md'>
                            {DUMMY_PROFILE.description}
                        </div>
                        <div className='grid grid-cols-3 grid-rows-2 gap-2'>
                            {
                                DUMMY_PROFILE.photo_link.map((image) => {
                                    return(
                                        <div className='h-explore_image_height aspect-square' key={image}>
                                            <Image src={image} className='w-full h-full rounded-default border-3 border-border_placeholder shadow-2xl' width={500} height={500} alt='-'/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='flex flex-wrap mt-4 gap-4'>
                            {
                                HOBBIES.map((hobby) => {
                                    return(
                                        <div className='rounded-default border-3 border-border_placeholder shadow-2xl px-4 py-2' key={hobby}>
                                            {hobby}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
}

export default Page

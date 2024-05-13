"use client"
import React from 'react'
import { getUserInterested } from '../utility/interestedController'
import Navbar from '../component/navbar'
import { getUserDataFromStorage } from '../utility/userDataController'
import { User } from '../../../declarations/likey_backend/likey_backend.did'

const InterestedPage = () => {

    const [userInterested, setUserInterested] = React.useState<User[]>()

    React.useEffect(() => {

        const fetchUserInterested = async() => {

            // const data = await getUserDataFromStorage()

            const data = await getUserInterested([4])
            console.log(data)

            // const 
            setUserInterested(data)

        }

        fetchUserInterested()

    }, [])


    return (
        <div className='w-screen h-screen bg-background flex justify-around items-center'>
            <Navbar pageName="Interest"/>

            <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
                <div className='w-full h-full'>
                    <h1 className='font-bold text-title'>
                        Interested in You 
                    </h1>   
                    <div className='grid grid-cols-6'>
                        {
                            userInterested?.map((user : User, idx) => {
                                return(
                                    <div key={idx}>
                                        <img src={user.profile_picture_link} className='h-explore_image_height aspect-square rounded-default border-border_placeholder border-3 shadow-2xl' alt=""/>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>        
            </div>
        </div>
    )
}


export default InterestedPage
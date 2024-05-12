"use client"
import React from 'react'
import { getUserInterested } from '../utility/interestedController'
import Navbar from '../component/navbar'

const InterestedPage = () => {

    const [userInterested, setUserInterested] = React.useState()

    React.useEffect(() => {

        const fetchUserInterested = async() => {
            const data = await getUserInterested([1])
            console.log(data)
        }

        fetchUserInterested()

    }, [])


    return (
        <div className='w-screen h-screen bg-background flex justify-around items-center'>
            <Navbar pageName="Explore"/>

            <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
                <div className='w-full h-full flex'>
                    <h1 className='font-bold text-title'>
                        Interested in You 
                    </h1>   
                    <div className='grid grid-cols-6'>

                    </div>
                </div>        
            </div>
        </div>
    )
}


export default InterestedPage
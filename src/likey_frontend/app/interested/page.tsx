"use client"
import React from 'react'
import { buyReveal, getUserInterested } from '../utility/interestedController'
import Navbar from '../component/navbar'
import { getUserDataFromStorage } from '../utility/userDataController'
import { User } from '../../../declarations/likey_backend/likey_backend.did'
import { UserData } from '../model'

const InterestedPage = () => {

    const [user, setUser] = React.useState<UserData>()
    const [interested, setInterested] = React.useState<any[]>()
    const [srcUser, setUserInterested] = React.useState<any[]>()

    React.useEffect(() => {

        const fetchUserInterested = async() => {

            const userData = await getUserDataFromStorage()

            const id = userData.user_id
            setUser(userData)

            const data = await getUserInterested(Object.values(id))
            console.log(data[0])

            // const 
            setInterested(data[0])
            setUserInterested(data[1])

        }

        fetchUserInterested()

    }, [])

    const purchase = async(dstId : number[]) => {
        const userData:any = await getUserDataFromStorage()
        console.log("DALAM NAMA TUHAN YESUS")
        

        const id = userData.user_id
        console.log(id)
        // const data : any = await getFeeds(Object.values(id))

        const buy = await buyReveal(Object.values(id), dstId)
        console.log(buy)
    }

    return (
        <div className='w-screen h-screen bg-background flex justify-around items-center'>
            <Navbar pageName="Interest"/>

            <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
                <div className='w-full h-full'>
                    <h1 className='font-bold text-title'>
                        Interested in You (tap to buy)
                    </h1>   
                    <div className='grid grid-cols-6'>
                        {
                            interested?.map((user : any, idx) => {
                                return(
                                    <div key={idx}>
                                        {user.is_revealed}
                                        <img src={srcUser? srcUser[idx].profile_picture_link : ""} onClick={() => {
                                            purchase(srcUser? Object.values(srcUser[idx].user_id) : [0])
                                        }} className={`h-explore_image_height ${user.is_revealed ? '' : 'blur-md'} aspect-square rounded-default border-border_placeholder border-3 shadow-2xl`} alt=""/>
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
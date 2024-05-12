"use client"
import React from 'react'
import Navbar from '../component/navbar';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faHeart, faHeartBroken, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DUMMY_PROFILE, HOBBIES } from '../dummy_data';
import { getUserData, getUserDataFromStorage } from '../utility/userDataController';
import { dec } from '../utility/cryptController';
import { getCookie } from 'cookies-next';
import { addInterest, getFeeds, getHobby } from '../utility/feedController';
import { FeedProfile, UserData, UserHobby } from '../model';
import Loading from '../utility/loading';

const Page = () => {
    
    const [user, setUser] = React.useState<UserData>()
    const [feed, setFeed]= React.useState<FeedProfile | null>()
    const [hobbies, setHobby] = React.useState<UserHobby[]>()

    const generateFeed = async() => {
        const id = user?.user_id || [1]
        console.log(id)
        const data : any = await getFeeds(id)
        console.log(data)

        const index : any = await getUserData(id)

        setFeed(data.Ok[0][index.Ok.last_swipe_index])

        const hobbyFetch : any= await getHobby(id)
        setHobby(hobbyFetch)
    }

    React.useEffect(()=> {

        const fetchUserData = async() => {
            // let cook = await dec(getCookie("my_principal_id")||"")
            // console.log(cook)

            // // nembak ID karena tidak bisa akses II punya ID
            // let afterParse = JSON.parse(cook||"{}")
            // console.log(afterParse)
            // // let afterParse = [1]
            // const userData : any = await getUserData(afterParse)
            // console.log(userData)

            const userData:any = await getUserDataFromStorage()
            console.log(userData)
            
            setUser(userData)
        }

        fetchUserData()
        generateFeed()

    }, [])

    

    const handleInterest = async(isInterest : boolean) => {
        const srcUser = user?.user_id || [1]
        const dstUser = feed?.user_id || [2]
        setFeed(null)
        const result = await addInterest(srcUser, dstUser, isInterest)
        console.log(result)
        generateFeed()
    }

    return (
      <div className='w-screen h-screen bg-background flex justify-around items-center'>
        
        <Navbar pageName="Explore"/>

        {
            feed?
            <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
                <div className='w-full h-full flex'>
                    {/* Picture and Interested Button */}
                    <div className='w-3/5 h-full relative'>
                        {/* Picture */}
                        <div className='w-full h-full'>
                            <Image src={feed.profile_picture_link} className='w-full h-full rounded-default border border-border_placeholder shadow-2xl' height={1000} width={1000} alt='missing'/>
                        </div>
                        {/* Button */}
                        <div className='absolute bottom-5 w-full flex justify-center h-interact_button_height'>
                            <div className='flex justify-between w-1/4 h-full'>
                                <button className='h-full border-3 border-background p-2 bg-background rounded-default' onClick={()=>{
                                    handleInterest(true)
                                }}>
                                    <FontAwesomeIcon icon={faHeart} color='red' className='h-full'/>
                                </button>
                                <button className='h-full border-3 border-background p-2 bg-background rounded-default' onClick={()=>{
                                    handleInterest(false)
                                }}>
                                    <FontAwesomeIcon icon={faHeartBroken} color='red' className='h-full'/>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Profile */}
                    <div className='w-2/5'>
                        {/* Fitler and remaining swipe */}
                        <div className='flex justify-end'>
                            {/* <button className='bg-background flex justify-center border-3 border-border_placeholder p-2 rounded-default shadow-2xl w-photo_form_input' onClick={handleOpenModal}>
                                <FontAwesomeIcon icon={faFilter} className='h-4 aspect-square text-border_placeholder pt-1'/>
                                <div className='ml-1'>
                                    Filter
                                </div>
                            </button> */}
                            <div className='bg-background border-3 border-border_placeholder p-2 rounded-default shadow-2xl w-photo_form_input flex justify-center'>
                                <FontAwesomeIcon icon={faMagnifyingGlass} className='h-4 aspect-square text-border_placeholder pt-1'/>
                                <div className='ml-1'>
                                    {user?.last_swipe_index != undefined ? 29 - user.last_swipe_index : 0}
                                </div>
                            </div>
                        </div>

                        {/* Bio Data */}
                        <div className='p-6'>
                            <div className="text-title font-extrabold">
                                {feed.first_name} {feed.last_name}
                            </div>
                            <div className={feed.gender === 'Female' ? 'text-girl text-content font-bold' : 'text-boy text-content font-bold'}>
                                {feed.gender}
                            </div>
                            <div className='text-content font-bold'>
                                {feed.height} cm / {feed.religion}
                            </div>
                            <div className='text-content font-bold'>
                                {feed.education}
                            </div>
                            <div className='text-md'>
                                {feed.description}
                            </div>
                            <div className='grid grid-cols-3 grid-rows-2 gap-2'>
                                {
                                    feed.photo_link.map((image) => {
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
                                    hobbies?.map((hobby) => {
                                        return(
                                            <div className='rounded-default border-3 border-border_placeholder shadow-2xl px-4 py-2' key={hobby.name}>
                                                {hobby.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <Loading/>
        }

        
      </div>
    )
}

export default Page

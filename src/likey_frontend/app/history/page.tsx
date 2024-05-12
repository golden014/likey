"use client"

import { useEffect, useState } from "react";
import { likey_backend } from "../../../declarations/likey_backend";
import Navbar from "../component/navbar";
import { UserData, UserHobby } from "../model";
import { getUserDataFromStorage } from "../utility/userDataController";
import Image from "next/image";
import { EDUCATIONS } from "../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const HistoryPage:any = () =>{
    const [history, setHistory] = useState<any>([])
    const [curr, setCurr] = useState<any>(null)
    const [hobbies, setHobby] = useState<UserHobby[]>()
    

    const fetchHistory = async (id:any) =>{
        if (id){
            const x = await likey_backend.get_not_interested_history(Object.values(id))
            // console.log(x)
            setHistory(x)
        }
    }

    const fetchUser = async () =>{
        const x = await getUserDataFromStorage()
        // console.log(x)
        return x
    }

    const initialize = async() =>{
        fetchUser().then((e)=>{
            // console.log(e)
            if(e.user_id){
                fetchHistory(e.user_id)
            }
        })
    }

    useEffect(()=>{
        initialize()
    }, [])

    useEffect(()=>{
        fetchHobby()
    }, curr)

    const fetchHobby = async() =>{
        const hobbyFetch : any= await likey_backend.get_all_hobby_by_user_id(curr)
        setHobby(hobbyFetch)
    }

    const handleInterest = async(isInterest : boolean) => {
        const srcUser = await fetchUser()
        const dstUser = curr

        const result = await likey_backend.rollback_user(Object.values(srcUser.user_id), dstUser.user_id)
        console.log(Object.keys(result))
        if(Object.keys(result)[0] == "Ok"){
            initialize()
        }else if (Object.keys(result)[0] == "Err"){
            alert("not enough likey coin")
        }
    }

    return(
        <div className='w-screen h-screen bg-background flex justify-around items-center'>
            <Navbar pageName="Profile"/>
            <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default flex flex-row'>
                <div className="w-2/5 h-full overflow-y-scroll flex flex-col p-6">
                    <p className="text-title font-bold mb-4">My History</p>
                    {
                        history.map((e:any)=>{
                            return(
                                <div onClick={()=>{setCurr(e)}} className="flex flex-row w-full h-16 items-center justify-start mb-2 space-x-5 border border-border_placeholder rounded-md p-2 hover:bg-gray-200 active:bg-gray-300" key={e.user_id}>
                                    <Image className="h-full aspect-square rounded-full object-cover" alt="missing" src={e.profile_picture_link}></Image>
                                    <p>{e.first_name}</p>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="w-3/5 h-full overflow-y-scroll flex flex-col items-center shadow-lg">
                    {
                        curr != null &&
                        <div className="w-full h-full">
                            <div className="w-full h-fit flex flex-row space-x-2">
                                <Image src={curr.profile_picture_link} alt="missing" className="w-96 h-96 aspect-square object-cover rounded-md"/>
                                <div className="w-1/2 h-full flex flex-col p-4">
                                    <p className="text-4xl font-extrabold">
                                        {curr.first_name} {curr.last_name}
                                    </p>
                                    <p className={curr.gender === 'Female' ? 'text-girl text-content font-bold' : 'text-boy text-content font-bold'}>
                                        {curr.gender}
                                    </p>
                                    <p className='text-content font-bold'>
                                        {curr.height} cm / {curr.religion}
                                    </p>
                                    <p className='text-content font-bold'>
                                        {EDUCATIONS[curr.education]}
                                    </p>
                                    <p className='text-md'>
                                        {curr.description}
                                    </p>
                                    <button className='w-20 h-20 border-3 border-background p-2 bg-background rounded-default' onClick={()=>{
                                        handleInterest(true)
                                    }}>
                                        <FontAwesomeIcon icon={faHeart} color='red' className='h-full'/>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full flex flex-row flex-wrap overflow-scroll">
                            {
                                curr.photo_link.map((image:any) => {
                                    return(
                                        <div className='h-explore_image_height aspect-square m-2' key={image}>
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
                                            <div className='rounded-default border-3 border-border_placeholder px-4 py-2' key={hobby.name}>
                                                {hobby.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default HistoryPage
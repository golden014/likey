"use client"
import React, { ChangeEvent } from 'react'
import Navbar from '../component/navbar';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faHeart, faHeartBroken, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DUMMY_PROFILE, HOBBIES } from '../dummy_data';
import { getUserData, getUserDataFromStorage } from '../utility/userDataController';
import { dec } from '../utility/cryptController';
import { getCookie } from 'cookies-next';
import { addInterest, getFeeds, getHobby } from '../utility/feedController';
import { FeedProfile, Filter, InterestRespond, UserData, UserHobby, UserPayloadData } from '../model';
import Loading from '../utility/loading';
import { database } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { EDUCATIONS, GENDERS, RELIGIONS } from '../data';
import { updateSwipeFilter } from '../utility/filterController';

const Page = () => {
    
    const [user, setUser] = React.useState<UserData>()
    const [feed, setFeed]= React.useState<FeedProfile | null>()
    const [hobbies, setHobby] = React.useState<UserHobby[]>()
    const [filter, setFilter] = React.useState<Filter>()

    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpenModal = () => {
      setModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
    };

    const generateFeed = async() => {
        console.log(user)
        // const id = user?.user_id || [4]
        // console.log(id)let cook = await dec(getCookie("my_principal_id")||"")
            // console.log(cook)
            let cook = await dec(getCookie("my_principal_id")||"")
            // // nembak ID karena tidak bisa akses II punya ID
            let afterParse = JSON.parse(cook||"{}")
            console.log(afterParse)
            // let afterParse = [1]
            // const userData : any = await getUserData(afterParse)
            const userDatum : any = await getUserData(afterParse)
            // console.log(userData)

            const userData = userDatum.Ok
            console.log(userDatum)

            // const userData:any = await getUserDataFromStorage()
            console.log("DALAM NAMA TUHAN YESUS")
            // console.log(userData.Ok)
            
            // setUser(userData)
            
        

        const id = userData.user_id
        console.log(id)
        const data : any = await getFeeds(Object.values(id))
        console.log(data)

        const index : any = userData.last_swipe_index

        console.log(index)

        setFeed(data.Ok[0][index])
        console.log("feed Data :",data.Ok[0][index])


        const hobbyFetch : any= await getHobby(Object.values(id))
        setHobby(hobbyFetch)
    }

    React.useEffect(()=> {

        const fetchUserData = async() => {
            let cook = await dec(getCookie("my_principal_id")||"")
            // console.log(cook)

            // // nembak ID karena tidak bisa akses II punya ID
            let afterParse = JSON.parse(cook||"{}")
            console.log(afterParse)
            // let afterParse = [1]
            // const userData : any = await getUserData(afterParse)
            const userDatum : any = await getUserData(afterParse)
            // console.log(userData)

            const userData = userDatum.Ok
            console.log(userDatum)

            // const userData:any = await getUserDataFromStorage()
            console.log("DALAM NAMA TUHAN YESUS")
            // console.log(userData.Ok)
            
            setUser(userData)
            console.log(userData)

            const id = userData.user_id
            console.log(id)
            const data : any = await getFeeds(Object.values(id))
            console.log(data)

            const index : any = userData.last_swipe_index

            console.log(index)

            setFeed(data.Ok[0][index])
            console.log("feed Data :",data.Ok[0][index])


            const hobbyFetch : any= await getHobby(Object.values(id))
            setHobby(hobbyFetch)

        }

        fetchUserData()

    }, [])

    const createChatInFirebase = async(user1 : string, user2 : string) => {

        const colRef = collection(database, "chat_room")

        const data = {
            user : [user1, user2],
            message : []
        }

        const docRef = await addDoc(colRef, data)
        console.log(docRef)
        console.log("aman?")
    }

    const handleInterest = async(isInterest : boolean) => {
        console.log(user, feed)

        const userData:any = await getUserDataFromStorage()
            console.log("DALAM NAMA TUHAN YESUS")
            // console.log(userData.Ok)
            
            setUser(userData)

            const id = userData.user_id
            console.log(id)

        const srcUser = Object.values(id) || [1]


        const dstUser = feed?.user_id || [2]
        setFeed(null)
        console.log(Array.from(srcUser), Array.from(dstUser), isInterest);
        
        const result : any = await addInterest(srcUser, Array.from(dstUser), isInterest)
        console.log("aaaa")
        console.log(result)

        if(result.Ok[0].is_matched == true){
            console.log("masuk sini")
            const user1 = Array.from(srcUser).join('')
            const user2 = Array.from(dstUser).join('')
            createChatInFirebase(user1, user2)
        }
        else{
            console.log("tidak masuk")
        }

        generateFeed()
    }

    const [minAge, setMinAge] = React.useState<number>(0)
    const [maxAge, setMaxAge] = React.useState<number>(0)
    const [minHeight, setMinHeight] = React.useState<number>(0)
    const [maxHeight, setMaxHeight] = React.useState<number>(0)
    const [religion, setReligion] = React.useState<string>("")
    const [education, setEducation] = React.useState<number>(0)
    const [gender, setGender] = React.useState<string>("")

    const updateFilter = async() => {

        const swipeFilters: UserPayloadData["swipe_filters"] = [
            ["Age", { Age: { data_start: minAge, data_end: maxAge } }],
            ["Height", { Height: { data_start: minHeight
                , data_end: maxHeight } }],
            ["Religion", { Religion: { data: religion } }],
            ["Gender", { Gender: { data: gender } }],
            ["Education", { Education: { data: education } }]
          ];

          const userData:any = await getUserDataFromStorage()
            console.log("DALAM NAMA TUHAN YESUS")
            // console.log(userData.Ok)
            
            setUser(userData)

            const id = userData.user_id
            console.log(id)

          const data = await updateSwipeFilter(Object.values(id) || [], swipeFilters)

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
                        <div className='flex justify-around'>
                            {
                                user?.filter_access ? <button className='bg-background flex justify-center border-3 border-border_placeholder p-2 rounded-default shadow-2xl w-photo_form_input' onClick={handleOpenModal}>
                                <FontAwesomeIcon icon={faFilter} className='h-4 aspect-square text-border_placeholder pt-1'/>
                                <div className='ml-1'>
                                    Filter
                                </div>
                            </button> : <></>
                            }
                            <div className={`fixed w-filter mt-6 bg-background p-6 rounded-default border-3 shadow-2xl h-filter flex justify-center content-center ${modalOpen ? 'block' : 'hidden'}`} >
                                <div className="flex flex-wrap justify-center w-full h-1/2">
                                    <div className='flex'>
                                        <label htmlFor="gender" className='font-bold pl-3'>Min Height</label>
                                        <input type="number" name='min_height' className='w-2/5 my-2 border-3 border-border_placeholder shadow-2xl rounded-default' onChange={(e) => {
                                          setMinHeight(parseInt(e.target.value.toString()))
                                        }}/>
                                        <label htmlFor="gender" className='font-bold pl-3'>Max Height</label>
                                        <input type="number" name='max_height' className='w-2/5 my-2 border-3 border-border_placeholder shadow-2xl rounded-default' onChange={(e) => {
                                            setMaxHeight(parseInt(e.target.value.toString()))
                                        }}/>
                                    </div>
                                    <div className='flex mt-6'>
                                        <label htmlFor="gender" className='font-bold pl-3'>Min Age</label>
                                        <input type="number" name='min_age' className='w-2/5 my-2 border-3 border-border_placeholder shadow-2xl rounded-default' onChange={(e) => {
                                            setMinAge(parseInt(e.target.value.toString()))
                                        }}/>
                                        <label htmlFor="gender" className='font-bold pl-3'>Max Age</label>
                                        <input type="number" name='max_age' className='w-2/5 my-2 border-3 border-border_placeholder shadow-2xl rounded-default' onChange={(e) => {
                                            setMaxAge(parseInt(e.target.value.toString()))
                                        }}/>
                                    </div>
                                    <div className='flex flex-col w-4/5 mt-6'>
                                        <label htmlFor="gender" className='font-bold pl-3'>Gender</label>
                                        <select  onChange={(e) => {
                                            setGender(e.target.value.toString())
                                        }}  name="gender" id="gender" className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2 appearance-none'>
                                            {
                                                GENDERS.map((gender) => {
                                                    return(
                                                        <option key={gender} value={gender}>{gender}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='flex flex-col w-4/5 mt-6'>
                                        <label htmlFor="religion" className='font-bold pl-3'>Religion</label>
                                        <select onChange={(e) => {
                                            setReligion(e.target.value.toString())
                                        }} name="religion" id="religion" className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2 appearance-none'>
                                            {
                                                RELIGIONS.map((religion) => {
                                                    return(
                                                        <option key={religion} value={religion}>{religion}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='flex flex-col w-4/5 mt-6'>
                                        <label htmlFor="education" className='font-bold pl-3'>Education</label>
                                        <select onChange={(e) => {
                                            setEducation(parseInt(e.target.value.toString()))
                                        }} name="education" id="education" className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2 appearance-none'>
                                            {
                                                EDUCATIONS.map((education) => {
                                                    return(
                                                        <option key={education} value={education}>{education}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='flex mt-6 justify-around'>
                                        <button onClick={updateFilter} className="inline-flex justify-center w-2/5 rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-whitefocus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                                            Update
                                        </button>
                                        <button onClick={handleCloseModal} className="inline-flex justify-center w-2/5 rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                                {EDUCATIONS[feed.education]}
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

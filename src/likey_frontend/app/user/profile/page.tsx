"use client"
import { ChangeEvent, useEffect, useState } from "react";
import { UpdateUserPayload, UserData } from "../../model";
import { EDUCATIONS, RELIGIONS } from "@/app/data";
import Navbar from "@/app/component/navbar";
import Image from "next/image";
import EditableField from "@/app/component/editableField";
import { likey_backend } from "../../../../declarations/likey_backend";
import { getUserDataFromDB, getUserDataFromStorage } from "@/app/utility/userDataController";
import Dropdown from "@/app/component/dropdown";
import EditablePicture from "@/app/component/editablePicture";
import RemovablePicture from "@/app/component/removablePicture";
import { uuid } from "uuidv4";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebaseConfig";
import { HOBBIES } from "@/app/dummy_data";
import Hobby from "@/app/component/hobby";
import HobbyComponent from "@/app/component/hobby";

const ProfilePage: any = () => {

    const [user, setUser] = useState<UserData>(
        {
            user_id: [],
            email: "",
            first_name: "",
            last_name: "",
            height: -999,
            gender: "",
            education: -999,
            religion: "",
            description: "",
            profile_picture_link: "",
            photo_link: [],
            likey_coin: -999,
            current_swipe: -999,
            filter_access: false,
            last_swipe_index: 0
        }
    )

    const educationData = [
        {
            "key": "Rather Not Say",
            "value": 0
        },
        {
            "key": "Primary Education",
            "value": 1
        },
        {
            "key": "Secondary Education",
            "value": 2
        },
        {
            "key": "Tertiary Education",
            "value": 3
        },
        {
            "key": "Undergraduate Studies",
            "value": 4
        },
        {
            "key": "Postgraduate Studies",
            "value": 5
        },
        {
            "key": "Doctoral Studies",
            "value": 6
        }
    ]

    const [userHobbies, setUserHobbies] = useState<any>([])

    const fetchHobby = async(id:any) =>{
        const hobbyFetch : any= await likey_backend.get_all_hobby_by_user_id(Object.values(id))
        const result:any = []
        hobbyFetch.map((x:any)=>{
            result.push(x.name)
        })
        setUserHobbies(result)
    }

    const religionData = RELIGIONS.map((r)=>{return {"key": r, "value": r} })

    const handleHobbyChange = async(key:any) =>{
        const payload = {
            user_id: Object.values(user.user_id),
            name: key
        }
        await likey_backend.update_hobby(payload)
        
        await fetchHobby(user.user_id)
    }

    const handleChange = async(name:any, value:any) =>{
        console.log(name, value, typeof value)
        setUser(prevData => ({
            ...prevData, [name] : value
        }))
        console.log(Object.values(user.photo_link))
        console.log("----tes");
        
        console.log(Object.values(user.user_id))

        // console.log(user)

        const payload:UpdateUserPayload = {
            height: user.height,
            profile_picture_link: user.profile_picture_link,
            education: user.education,
            description: user.description,
            first_name: user.first_name,
            last_name: user.last_name,
            religion: user.religion,
            photo_link: Object.values(user.photo_link)
        }

        const newpayload = {
            ...payload, [name]: value
        }

        console.log(newpayload)

        const newdata = await likey_backend.update_user(Object.values(user.user_id), newpayload)

        console.log(newdata)
        await getUserDataFromDB(Object.values(user.user_id))
        await fetchUserData()
    }

    const changePicture = (async(newLink:any)=>{
        await handleChange("profile_picture_link", newLink)
    })

    const removePicture = async(url:string) =>{
        let x = user.photo_link
        let index = x.indexOf(url)
        console.log(index)
        x.splice(x.indexOf(url), 1)
        console.log(x)
        await handleChange('photo_link', x)
    }

    const uploadPicture = async(e: ChangeEvent<HTMLInputElement>)=>{
        console.log(user.photo_link)
        const fileId = uuid()
        if(e.target.files){
            const imageRef = ref(storage, fileId)
            uploadBytes(imageRef, e.target.files[0]).then((e)=>{
                getDownloadURL(e.ref).then((url)=>{
                    let x = user.photo_link
                    x.push(url)

                    handleChange('photo_link', x)
                })
            })
        }
    }

    const fetchUserData = async() => {
        // //dummy
        // const dummy: UserData = {
        //     user_id: 1,
        //     email: "josua@email.com",
        //     first_name: "Josua",
        //     last_name: "Golden",
        //     height: 200,
        //     gender: "Male",
        //     education: 4,
        //     religion: "Christian",
        //     description: "this is description",
        //     profile_picture_link: "https://picsum.photos/id/237/200/300",
        //     photo_link: ["https://picsum.photos/200/300", "https://picsum.photos/200/300", "https://picsum.photos/200/300", "https://picsum.photos/200/300"],
        //     likey_coin: 100,
        //     current_swipe: 30,
        //     filter_access: false,
        //     hobby: ["Badminton", "Movies", "Ur Mom", "Basketball"]
        // }

        // console.log(getUserDataFromStorage())
        const x: any= await getUserDataFromStorage()
        if(x!==null){
            setUser({
                user_id: x['user_id'],
                email: x['email'],
                first_name: x['first_name'],
                last_name: x['last_name'],
                height: x['height'],
                gender: x['gender'],
                education: x['education'],
                religion: x['religion'],
                description: x['description'],
                profile_picture_link: x['profile_picture_link'],
                photo_link: x['photo_link'],
                likey_coin: x['likey_coin'],
                current_swipe: x['current_swipe'],
                filter_access: x['filter_access'],
                last_swipe_index: x['last_swipe_index']
            })
            console.log(x)
            await fetchHobby(x['user_id'])
        }
    }

    useEffect(() => {
        //TODO - wait for auth
        fetchUserData();
    },[]);

    return (
        <div className='w-screen h-screen bg-background flex justify-around items-center'>
            <Navbar pageName="Profile"/>
            <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4 flex flex-row'>
            {user &&
                <>
                    <div className='w-3/5 h-full relative'>
                        <EditablePicture pic={user.profile_picture_link} update={changePicture}/> 
                    </div>
                    <div className='w-2/5 h-full relative px-10 space-y-2 overflow-y-scroll'>
                        <div className="w-full flex flex-row content-evenly">
                            <div className="flex flex-col w-1/2 px-1">
                                <p className="text-xs text-gray-400">First Name</p>
                                <EditableField name="first_name" func={handleChange} data={user.first_name}></EditableField>
                            </div>
                            <div className="flex flex-col w-1/2 px-1">
                                <p className="text-xs text-gray-400">Last Name</p>
                                <EditableField name="last_name" func={handleChange} data={user.last_name}/>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex flex-col w-full px-1">
                                <p className="text-xs text-gray-400">Description</p>
                                <EditableField name="description" func={handleChange} data={user.description}/>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex flex-col w-full px-1">
                                <p className="text-xs text-gray-400">Height</p>
                                <EditableField name="height" func={handleChange} data={user.height}/>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex flex-col w-full px-1">
                                <p className="text-xs text-gray-400">Education</p>
                                <Dropdown name="education" func= {handleChange} data={user.education} options={educationData}/>
                            </div>
                        </div>
                        <div className="w-full flex flex-row content-evenly">
                            <div className="flex flex-col w-full px-1">
                                <p className="text-xs text-gray-400">Religion</p>
                                <Dropdown name="religion" func= {handleChange} data={user.religion} options={religionData}/>
                            </div>
                        </div>

                        <div className="flex flex-col w-full h-72 px-1">
                                <p className="text-xs text-gray-400">Pictures of you</p>
                                <div className="w-full flex flex-row flex-wrap overflow-scroll">
                                    <label htmlFor="fileupload" className='h-explore_image_height aspect-square bg-blue-200 hover:bg-blue-300 active:bg-blue-400 flex items-center justify-center rounded-default text-xl mb-1 mr-1'>+</label>
                                    {
                                        user.photo_link.map((photo)=>{
                                            return(
                                                <div className="h-explore_image_height aspect-square" key={photo}>
                                                    <RemovablePicture pic={photo} remove={removePicture}/>
                                                </div>
                                            )
                                        })
                                    }
                                    <input className="hidden" type="file" id="fileupload" onInput={uploadPicture}/>
                                </div>
                            </div>

                            <div className="flex flex-col w-full h-72 px-1">
                                <p className="text-xs text-gray-400">Hobbies</p>
                                <div className="w-full flex flex-row flex-wrap overflow-scroll">
                                    {
                                        HOBBIES.map((hobby)=>{
                                            console.log(hobby)
                                            return(
                                                <HobbyComponent key={hobby} h={hobby} method={handleHobbyChange} userHobbies={userHobbies}></HobbyComponent>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                    </div>
                </>
            }
            </div>
        </div>
    );
}

export default ProfilePage

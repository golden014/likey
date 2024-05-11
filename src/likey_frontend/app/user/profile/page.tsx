"use client"
import { useEffect, useState } from "react";
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
            hobby: []
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

    const religionData = RELIGIONS.map((r)=>{return {"key": r, "value": r} })

    const handleChange = async(name:any, value:any) =>{
        console.log(name, value, typeof value)
        setUser(prevData => ({
            ...prevData, [name] : value
        }))
        // console.log(Object.values(user.user_id))

        // console.log(user)

        const payload:UpdateUserPayload = {
            height: user.height,
            profile_picture_link: user.profile_picture_link,
            education: user.education,
            description: user.description,
            first_name: user.first_name,
            last_name: user.last_name,
            religion: user.religion
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

    const uploadPicture = () =>{}

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
                hobby: x['hobby']
            })
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
                    <div className='w-2/5 h-full relative px-10 space-y-2'>
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
                                    <label htmlFor="fileupload" className='h-explore_image_height aspect-square bg-blue-200 hover:bg-blue-300 active:bg-blue-400 rounded-default text-xl mb-1 mr-1'>+</label>
                                    <div className="h-explore_image_height aspect-square">
                                        <RemovablePicture pic={"https://picsum.photos/200/200"} remove={()=>{console.log("test")}}/>
                                    </div>
                                    <input type="file" id="fileupload" onInput={uploadPicture}/>
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

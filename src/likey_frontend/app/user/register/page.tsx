"use client"
import React, { useEffect, useState } from 'react'
import { Hobby, RegisterDataType, UserData, UserPayloadData } from '../../model'
import PhotoUpload from './photo'
import Biodata from './biodoata'
import InterestPage from './hobby'
import { MUSIC_GENRES, OTHERS_HOBBIES, SPORTS } from '@/app/data'
import { getCookie, hasCookie } from 'cookies-next'
import { dec } from '@/app/utility/cryptController'
import { useRouter } from 'next/navigation'
import { likey_backend } from '../../../../declarations/likey_backend'

const RegisterPage = () => {
    const router = useRouter()
    // const [user, setUser] = useState<UserData>(
    //     {
    //         user_id: [],
    //         email: "",
    //         first_name: "",
    //         last_name: "",
    //         height: -999,
    //         gender: "",
    //         education: -999, 
    //         religion: "",
    //         description: "",
    //         profile_picture_link: "",
    //         photo_link: [],
    //         likey_coin: -999,
    //         current_swipe: -999,
    //         filter_access: false,
    //         hobby: []
    //     }
    // )

    // type FilterAttributeGender = {
    //     Gender: {data: String} 
    // }
    // type FilterAttributeEducation = {
    //     Education: {data: number}
    // }
    // type FilterAttributeReligion = {
    //     Religion: {data: String}
    // }
    // type FilterAttributeHeight = {
    //     Height: {data_start: number, data_end: number},
    // }
    // type FilterAttributeAge = {
    //     Age: {data_start: number, data_end: number}
    // }
    // type test = [[string, FilterAttributeAge],[string, FilterAttributeHeight],[string, FilterAttributeReligion],[string, FilterAttributeGender],[string, FilterAttributeEducation]]
    // const swipeFilters: test = [
    //     ["Age", {
    //         Age: {
    //             data_start: 0|0,
    //             data_end: 0|0
    //         }
    //     }],
    //     ["Height", {
    //         Height: {
    //             data_start: 0|0,
    //             data_end: 0|0
    //         }
    //     }],
    //     ["Religion", {
    //         Religion: {
    //             data: ""
    //         }
    //     }],
    //     ["Gender", {
    //         Gender: {
    //             data: ""
    //         }
    //     }],
    //     ["Education", {
    //         Education: {
    //             data: 0|0
    //         }
    //     }]
    // ];             
    
    const swipeFilters: UserPayloadData["swipe_filters"] = [
        ["Age", { Age: { data_start: 0, data_end: 0 } }],
        ["Height", { Height: { data_start: 0, data_end: 0 } }],
        ["Religion", { Religion: { data: "" } }],
        ["Gender", { Gender: { data: "" } }],
        ["Education", { Education: { data: 0 } }]
      ];

    const [registerData, setRegisterData] = React.useState<UserPayloadData>({
        user_principal_id: [],
        first_name : "",
        last_name : "",
        height : 120,
        gender : "Male",
        education : 0,
        religion : "",
        description : "",
        profile_picture_link: "",
        photo_link: [],
        likey_coin: 0,
        current_swipe: 10,
        filter_access: false,
        swipe_filters: swipeFilters,
        dob: "",
        last_swipe_index: 0
    })
    const [registerHobbyData, setRegisterHobbyData] = React.useState<Hobby>({
        user_id: [],
        name: [],
    })

    const [page, setPage] = React.useState(1)
    
    const handleChanges = (fieldName: string, value: string) => {
        setRegisterData(prevData => ({
            ...prevData, [fieldName] : value
          }))
        console.log(registerData)
    }

    useEffect(() => {
        console.log(registerData)
     }, [registerData])

    const handleHobby = (name : string) => {
        const arrayOfHobbies = registerHobbyData.name

        const index = arrayOfHobbies.indexOf(name)

        console.log("hobby");
        

        if(index !== -1){
            console.log("remove hobby");
            
            arrayOfHobbies.splice(index, 1)
        }
        else{
            console.log("added hobby");
            
            arrayOfHobbies.push(name)
        }
        
    }

    const nextPage = () => {
        setPage(page + 1)
    }

    const handleCookie = async ()=>{
        console.log(hasCookie("my_principal_id"))
        let cook = await dec(getCookie("my_principal_id")||"")
        let cook2 = await getCookie("wswsws")
        console.log(JSON.parse(cook || "{}")) 
        console.log(cook2)                                                                                                 
    }

    const prevPage = () => {
        setPage(page - 1)
    }

    const debug = () => {
        console.log(registerData)
    }

    // const fetchUserData = async() => {
    //     const x: any= await getUserDataFromStorage()
    //     if(x!==null){
    //         setUser({
    //             user_id: x['user_id'],
    //             email: x['email'],
    //             first_name: x['first_name'],
    //             last_name: x['last_name'],
    //             height: x['height'],
    //             gender: x['gender'],
    //             education: x['education'],
    //             religion: x['religion'],
    //             description: x['description'],
    //             profile_picture_link: x['profile_picture_link'],
    //             photo_link: x['photo_link'],
    //             likey_coin: x['likey_coin'],
    //             current_swipe: x['current_swipe'],
    //             filter_access: x['filter_access'],
    //             hobby: x['hobby']
    //         })
    //     }
    // }

    const Register = async () => {
        console.log(registerData)

        let cook = await dec(getCookie("my_principal_id")||"")
        let afterParse = JSON.parse(cook||"{}")
        console.log(afterParse) 
        

        const payload:UserPayloadData = {
            user_principal_id: afterParse,
            first_name: registerData.first_name,
            last_name: registerData.last_name,
            height: registerData.height | 0,
            gender: registerData.gender,
            education: registerData.education | 0,
            religion: registerData.religion,
            description: registerData.description,
            profile_picture_link: registerData.profile_picture_link,
            photo_link: registerData.photo_link,
            likey_coin: registerData.likey_coin | 0,
            current_swipe: registerData.current_swipe | 0,
            filter_access: registerData.filter_access,
            swipe_filters: swipeFilters,
            dob: registerData.dob.toString()    ,
            last_swipe_index: registerData.last_swipe_index      
        }

        const newdata = await likey_backend.create_user(
            payload
        ).then(
            ()=>{
                router.push('/explore')
            }
        )
        console.log(newdata)
        // const userData = await getUserDataFromDB(Object.values(user.user_id))
        // console.log("line 186", userData)
        // await fetchUserData()

        
        
    }

    const handleRegister = ()=>{
        console.log(registerData)
    }

    const renderPage = () => {
        if(page == 1){
            return(
                <Biodata onChanges={handleChanges} goNext={nextPage}/>
            )
        }
        else if(page == 2){
            return(
                <PhotoUpload goNext={nextPage}/>
            )
        }
        else if(page == 3){
            return(
                <InterestPage onChanges={handleHobby} goNext={nextPage} name='Sports' list={SPORTS}/>
            )
        }
        else if(page == 4){
            return(
                <InterestPage onChanges={handleHobby} goNext={nextPage} name='Music Genres' list={MUSIC_GENRES}/>
            )
        }
        else if(page == 5){
            return(
                <InterestPage onChanges={handleHobby} goNext={nextPage} name='Other Hobbies' list={OTHERS_HOBBIES}/>
            )
        }
        
        else{
            Register()
            
        }
    }

    return (
        <>
        {
            renderPage()
        }
        {
            page > 1 ? 
            <button onClick={prevPage} className='absolute bottom-3 left-3 w-8 h-8 border-3 border-border_placeholder bg-background rounded-full'> &lt; </button> 
    
            :
            <></>
        }
        </>
    )
}

export default RegisterPage

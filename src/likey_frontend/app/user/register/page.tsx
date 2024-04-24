"use client"
import React, { useEffect } from 'react'
import EmailAndPass from './email_and_pass'
import { RegisterDataType } from '../../model'
import PhotoUpload from './photo'
import Biodata from './biodoata'
import InterestPage from './hobby'
import { MUSIC_GENRES, OTHERS_HOBBIES, SPORTS } from '@/app/data'
import { NextResponse } from 'next/server'

const RegisterPage = () => {

    const [registerData, setRegisterData] = React.useState<RegisterDataType>({
        email : "",
        password : "",
        first_name : "",
        last_name : "",
        height : 120,
        gender : "Male",
        education : 0,
        religion : "",
        description : "",
        hobbies: []
    })

    const [page, setPage] = React.useState(1)
    
    const handleChanges = (fieldName: string, value: string) => {
        setRegisterData(prevData => ({
            ...prevData, [fieldName] : value
          }))
    }

    const handleHobby = (name : string) => {
        const arrayOfHobbies = registerData.hobbies

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

    const prevPage = () => {
        setPage(page - 1)
    }

    const debug = () => {
        console.log(registerData)
    }

    const register = () => {
        console.log(registerData)
    }

    const renderPage = () => {
        if(page == 1){
            return(
                <EmailAndPass onChanges={handleChanges} goNext={nextPage}/>
            )
        }
        else if(page == 2){
            return(
                <PhotoUpload goNext={nextPage}/>
            )
        }
        else if(page == 3){
            return(
                <Biodata onChanges={handleChanges} goNext={nextPage}/>
            )
        }
        else if(page == 4){
            return(
                <InterestPage onChanges={handleHobby} goNext={nextPage} name='Sports' list={SPORTS}/>
            )
        }
        else if(page == 5){
            return(
                <InterestPage onChanges={handleHobby} goNext={nextPage} name='Music Genres' list={MUSIC_GENRES}/>
            )
        }
        else if(page == 6){
            return(
                <InterestPage onChanges={handleHobby} goNext={nextPage} name='Other Hobbies' list={OTHERS_HOBBIES}/>
            )
        }
        else{
            register()
            return(
                <div>
                    Hehe
                </div>
            )
        }
    }

    return (
        <>
        {
            renderPage()
        }
        {
            page > 1 ? <button onClick={prevPage} className='absolute bottom-3 left-3 w-8 h-8 border-3 border-border_placeholder bg-background rounded-full'> &lt; </button> : <></>
        }
        </>
    )
}

export default RegisterPage

"use client"
import React from 'react'
import EmailAndPass from './email_and_pass'
import { RegisterDataType } from '../model'
import PhotoUpload from './photo'
import Biodata from './biodoata'
import InterestPage from './interest'
import { SPORTS } from '@/app/data'

const RegisterPage = () => {

    const [registerData, setRegisterData] = React.useState<RegisterDataType>({
        email : "",
        password : "",
        first_name : "",
        last_name : "",
        gender : "",
        height : 0,
        education : 0
    })

    const [page, setPage] = React.useState(1)
    
    const handleChanges = (fieldName: string, value: string) => {
        setRegisterData(prevData => ({
            ...prevData, [fieldName] : value
          }))
    }

    const handleHobby = (name : string) => {

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
        return(
            <div>
                loh
            </div>
        )
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

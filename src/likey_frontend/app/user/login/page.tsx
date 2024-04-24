"use client"

import { log } from "console"
import { ChangeEvent, useState } from "react"
import { likey_backend, createActor } from '../../../../declarations/likey_backend';
import { UserProfilePayload } from "../../../../declarations/likey_backend/likey_backend.did";

async function getStaticProps() {
    const idxd = process.env.CANISTER_ID_LIKEY_BACKEND            
}

const LoginPage = () =>{
    const [loginData, setLoginData] = useState({
        email : "",
        password : ""
    })

    const handleChange = (e:ChangeEvent<HTMLInputElement>) =>{
        setLoginData(prevData => ({
            ...prevData, [e.target.name] : e.target.value
        }))
    }

    const handleLogin = async (e:any) =>{
        e.preventDefault()

        let a: UserProfilePayload = {
            'height' : 5,
            'profile_picture_link' : "test",
            'education' : 3,
            'description' : "Test Update",
            'first_name' : "Joshua",
            'last_name' : "Caris",
            'religion' : "Atheist",
        }

        console.log(a);
        
        let b = await likey_backend.update_user(BigInt(1),a);
        console.log(b)
    }

    return(
        <div className="w-screen h-screen flex flex-row bg-background items-start justify-center">
            <form onSubmit={handleLogin} className='w-1/2 h-full flex flex-col items-center justify-center'>
                <p className="text-text text-title font-bold">Welcome Back!</p>
                <br />
                <div className='w-4/5 h-auth_form_input'>
                    <input onChange={handleChange} type="email" placeholder='Email' name='email' className='text-text w-full h-full p-6 rounded-default border border-border_placeholder bg-background shadow-xl' ></input>
                </div>
                <div className='w-4/5 h-auth_form_input my-6'>
                    <input onChange={handleChange} type="password" placeholder='Password' name='password' className='text-text w-full h-full p-6 rounded-default border border-border_placeholder bg-background shadow-xl'></input>
                </div>
                <div className='w-4/5 h-auth_form_input'>
                    <button className='w-full h-full bg-main rounded-default shadow-xl'>Login</button>
                </div>
                <div className='mt-6 text-text'>
                    Don{"'"}t have an account?
                    <a href={"/user/register"} className='ml-1'>
                        <span className='text-boy'>Join</span> 
                        <span className='text-girl mx-1'>Likey</span> 
                        <span className='text-boy'>Now!</span> 
                    </a>
                </div>
            </form>
            <img src="/images/jojos_pantai.jpeg" className="w-1/2 bg-red-500 h-full cover object-cover rounded-l-xl drop-shadow-xl"/>
        </div>
    )
}

export default LoginPage
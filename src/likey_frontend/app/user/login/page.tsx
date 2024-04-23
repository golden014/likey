"use client"

import { log } from "console"
import { ChangeEvent, useState } from "react"

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

    const handleLogin = (e:any) =>{
        e.preventDefault()
        console.log(loginData)
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
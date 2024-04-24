"use client"
// import Link from 'next/link'
import React, { ChangeEvent } from 'react'


const EmailAndPass = ({ onChanges, goNext } : {onChanges: (fieldName: string, value: string) => void, goNext: () => void}) => {

    const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        onChanges(name, value)
    }

    return (
        <div className='w-screen h-screen flex justify-around items-center flex-nowrap bg-white'>
            {/* Left Part */}
            <div className='w-2/5 p-6 '>
                <div className='text-title font-bold'>
                    Welcome to Likey!
                </div>
                <div className='text-content'>
                    &quot;Discover love on Likey! 💖 Meet like-minded singles and spark meaningful connections. Sign up now and start swiping towards your happily ever after!&quot;
                </div>
            </div>
            {/* Right Part A.K.A Form */}
            <div className='w-2/5 p-6 '>
                {/* Email */}
                <div className='w-4/5 h-auth_form_input'>
                    <input onChange={handleChange} placeholder='Email' name='email' className='w-full h-full p-6 rounded-default border border-border_placeholder bg-background shadow-xl' ></input>
                </div>
                {/* Password */}
                <div className='w-4/5 h-auth_form_input my-6'>
                    <input onChange={handleChange} placeholder='Password' name='password' className='w-full h-full p-6 rounded-default border border-border_placeholder bg-background shadow-xl'></input>
                </div>
                {/* Join Button */}
                <div className='w-4/5 h-auth_form_input'>
                    <button onClick={goNext} className='w-full h-full bg-main rounded-default shadow-xl'>Join Likey</button>
                </div>
                {/* Navigate to Register */}
                {/* <div className='mt-6'>
                    Already have an account?
                    <Link href={"/user/login"} className='ml-1'>
                        <span className='text-boy'>Login</span> 
                        <span className='text-girl mx-1'>Likey</span> 
                        <span className='text-boy'>Now!</span> 
                    </Link>
                </div> */}
            </div>
        </div>
    )
}

export default EmailAndPass
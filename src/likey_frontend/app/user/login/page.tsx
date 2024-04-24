"use client"

import { ChangeEvent, useState } from "react"
import { AuthClient } from "@dfinity/auth-client";
import { useRouter } from "next/navigation";
import { likey_backend } from "../../../../declarations/likey_backend";

const LoginPage = () =>{
    const router = useRouter()

    const [loginData, setLoginData] = useState({
        email : "",
        password : ""
    })

    const handleChange = (e:ChangeEvent<HTMLInputElement>) =>{
        setLoginData(prevData => ({
            ...prevData, [e.target.name] : e.target.value
        }))
    }

    // One day in nanoseconds
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);

    const defaultOptions = {
        createOptions: {
          idleOptions: {
            // Set to true if you do not want idle functionality
            disableIdle: true,
          },
        },
        loginOptions: {
          identityProvider: "https://identity.ic0.app",
          maxTimeToLive: days * hours * nanoseconds,
        },
      };

    const handleLogin = async (e:any) =>{
        e.preventDefault();
        const authClient = await AuthClient.create(defaultOptions.createOptions);

        if (await authClient.isAuthenticated()) {
            router.push('/home')
        }else{
            authClient.login(defaultOptions.loginOptions).then(async ()=>{
                const user = await likey_backend.get_user_by_principal_id(authClient.getIdentity().getPrincipal().toString());
                if (user !== null) {
                    router.push('/user/register');
                }
                else{
                    router.push('/home')
                }
            }).catch((e)=>{
                console.log(e)
            })
        }
    }

    return(
        <div className="w-screen h-screen flex flex-row bg-background items-start justify-center">
            <form onSubmit={handleLogin} className='w-1/2 h-full flex flex-col items-center justify-center'>
                <p className="text-text text-title font-bold">Welcome Back!</p>
                <br />
                {/* <div className='w-4/5 h-auth_form_input'>
                    <input onChange={handleChange} type="email" placeholder='Email' name='email' className='text-text w-full h-full p-6 rounded-default border border-border_placeholder bg-background shadow-xl' ></input>
                </div>
                <div className='w-4/5 h-auth_form_input my-6'>
                    <input onChange={handleChange} type="password" placeholder='Password' name='password' className='text-text w-full h-full p-6 rounded-default border border-border_placeholder bg-background shadow-xl'></input>
                </div> */}
                <div className='w-4/5 h-auth_form_input'>
                    <button className='text-white w-full h-full bg-main rounded-default shadow-xl'>Login using Internet Identity</button>
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
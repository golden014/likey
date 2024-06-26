"use client"

import { ChangeEvent, useState } from "react"
import { AuthClient } from "@dfinity/auth-client";
import { useRouter } from "next/navigation";
import { getUserDataFromDB, getUserDataFromStorage } from "@/app/utility/userDataController";
import { getCookie, setCookie } from "cookies-next";
import { dec, enc } from "@/app/utility/cryptController";


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

        // console.log(await getUserDataFromStorage())

        // var temp = [100,238,111,73,221,32,5,181,37,11,79,95,66,249,28,123,212,136,29,121,163,165,57,28,176,110,237,97,2]        
        // var user = await getUserDataFromDB(temp)
        // console.log(JSON.stringify(user))
        // var a = await enc(JSON.stringify(user));
        // console.log(a)
        // var b = await dec(a);
        // console.log(b)
        // var c = JSON.parse(b || "");
        // console.log(c)


        // console.log(temp)
        // console.log(await getUserDataFromStorage())

        const authClient = await AuthClient.create(defaultOptions.createOptions);
        
        // console.log(authClient.getIdentity().getPrincipal())
        
        // console.log(user)
       

        if (await authClient.isAuthenticated()) {
            console.log("dah ada")
            const user = await getUserDataFromDB(Array.from(authClient.getIdentity().getPrincipal().toUint8Array()))
            if(user == null){
                console.log("line 69", "user null")
                router.push('/user/register')
            }else{
                
                router.push('/explore')
            }
        }
        else{
            authClient.login(defaultOptions.loginOptions).then(async ()=>{
        //         const user = await getUserDataFromDB(authClient.getIdentity().getPrincipal().toString())
            // console.log(authClient.getIdentity().getPrincipal().toString())
            // const user = await getUserDataFromDB(Array.from(authClient.getIdentity().getPrincipal().toUint8Array()))
            
            // if(user == null){
            //     console.log("line 76", "user null")
            //     router.push('/user/login')
            // }
            // else{
            //     router.push('/explore')
            // }            
            router.push('/user/login')

        //         const user = await likey_backend.get_user(authClient.getIdentity().getPrincipal())
        //         if (user !== null) {
        //             // router.push('/user/register');
        //         }
        //         else{
        //             // router.push('/home')
        //         }
            }).catch((e)=>{
                console.log("login 85",e)
            })
        }
    }

    return(
        <div className="w-screen h-screen flex flex-row bg-background items-start justify-center">
            <form onSubmit={handleLogin} className='w-1/2 h-full flex flex-col items-center justify-center'>
                <p className="text-text text-title font-bold">Welcome</p>
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
                
            </form>
            <img src="/images/merpati.jpg" className="w-1/2 bg-red-500 h-full cover object-cover rounded-l-xl drop-shadow-xl"/>
        </div>
    )
}

export default LoginPage
"use client"
import React, { useEffect, useState } from 'react'
import Navbar from "@/app/component/navbar";
import { UpdateUserCoinPayload, UserData } from "../model";
import {likey_backend} from "../../../declarations/likey_backend"
import { getUserDataFromDB, getUserDataFromStorage } from "@/app/utility/userDataController";

const Page =  () => {
  const [errorMessage, setErrorMessage] = React.useState("")
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
  
  const handleAddCoin = async (coin:number)=>{
    console.log("user.id", user.user_id)
    console.log("user coin before add", user.likey_coin)
    console.log("click");
    const likey_coin:number = coin
    console.log("total coin", likey_coin)
    const payload : UpdateUserCoinPayload = {
      likey_coin: likey_coin
    }

    
    const statusHandleAddCoin = await likey_backend.update_coin(
      Object.values(user.user_id),
      payload
    )

    console.log(statusHandleAddCoin)
    await getUserDataFromDB(Object.values(user.user_id)).then(()=>{
      fetchUserData()
    })
  }

  const handleFeaturePayment = async (featureType:number)=>{
    if(user.filter_access == true){
      setErrorMessage("You have purchased feature access!")
    }

    const statusHandleFilterAccess = await likey_backend.buy_filter_access(
      Object.values(user.user_id)
    )

    console.log(statusHandleFilterAccess)
    await getUserDataFromDB(Object.values(user.user_id)).then(()=>{
      fetchUserData()
    })

  }

  const handleAddSwipe = async (swipe:number)=>{
    // if(user.current_swipe > 0){
    //   setErrorMessage("Add swipe only can while you have 0 swipe left!")
    // }
    // else{
      const statusHandleAddSwipe = await likey_backend.add_swipe(
        Object.values(user.user_id),
        swipe,
        user.current_swipe
      )
  
      console.log(statusHandleAddSwipe)
      await getUserDataFromDB(Object.values(user.user_id)).then(()=>{
        fetchUserData()
      })
    // }
  }

  const fetchUserData = async() => {
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
    }
}

useEffect(() => {
    //TODO - wait for auth
    fetchUserData();
},[]);

  return (
    <div className='w-screen h-screen bg-background flex justify-around items-center'>
        <Navbar pageName="Purchase"/>
        <div className="w-3/5 bg-indigo-700 shadow-2xl h-fit_screen w-page_width rounded-default p-4 flex flex-row" >
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Unlock limitless possibilities!</span>
              <span className="block">Get Likey Coin with ICP for seamless transactions.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-200">
            With Likey Coin, access any feature on our website seamlessly. Elevate your experience today!
            </p>
            <h5>Your Coin {user.likey_coin}</h5>
            <div className="m-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                onClick={()=>handleAddCoin(100)}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Buy 100 Coin
              </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                onClick={()=>handleAddCoin(150)}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Buy 150 Coin
              </a>
              </div>
            </div>

            


            <p className="mt-4 text-lg leading-6 text-indigo-200">
              Dont Miss Out! Upgrade to Catch More People!
            </p>
            <p className="mt-4 text-lg leading-6 text-indigo-200">
              Special offer only today!
            </p>
            <h5 className='mt-2 text-sm text-red-700'>{errorMessage}</h5>
            <div className="mt-8 flex justify-center">
              

              <div className="ml-3 inline-flex rounded-md shadow">
                <a
                  href="#"
                  onClick={()=>handleAddSwipe(10)}
                  className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
                >
                  Bundle add swipe 10 Swipe - 50 Likey Coin
                </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a
                  href="#"
                  onClick={()=>handleAddSwipe(20)}
                  className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
                >
                  Bundle add swipe 20 Swipe - 100 Likey Coin
                </a>
              </div>

              <div className="ml-3 inline-flex rounded-md shadow">  
                <a
                  href="#"
                  onClick={()=>handleFeaturePayment(2)}
                  className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
                >
                  Filter Access @100 Likey Coin
                </a>
              </div>

              
            </div>
            
          </div>
        </div> 
    </div>
    )

}

export default Page
"use client"
import React, { useState } from 'react'
import Navbar from "@/app/component/navbar";
import { UpdateUserCoinPayload, UserData } from "../model";
import likey_backend from "../../../declarations/likey_backend"
import { getUserDataFromDB, getUserDataFromStorage } from "@/app/utility/userDataController";

const page = async () => {

  const handleAddCoin = async (coin:number)=>{
    console.log("click");
    const likey_coin:number =  coin
    const payload : UpdateUserCoinPayload = {
      likey_coin: likey_coin
    }

    const paramPrimaryId: Uint8Array = new Uint8Array([1])
    const statusHandleAddCoin = await likey_backend.likey_backend.update_coin(
      paramPrimaryId,
      payload
    )
    console.log(paramPrimaryId)

  }

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
            <a
              href="#"
              onClick={()=>handleAddCoin(100)}
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
            >
              Buy 100 Coin
            </a>
            <a
              href="#"
              onClick={()=>handleAddCoin(150)}
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
            >
              Buy 150 Coin
            </a>
          </div>
        </div> 
    </div>
    )

}

export default page
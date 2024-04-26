"use client"
import React, { ChangeEvent } from 'react'
import Navbar from '../component/navbar';
import Image from 'next/image';
import { CHAT_FRIENDS, DUMMY_IMAGE, DUMMY_NAME } from '../dummy_data';
import { DateConverter } from '../utility/converter';
import { Chat } from '../model';
import { get, ref } from 'firebase/database';
import { database } from '../firebaseConfig';
import Emptypage from './emptyPage';
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';

const ChatPage = () => {

    const [chats, setChats] = React.useState<Chat[]>([])
    const [currentUser, setCurrentUser] = React.useState<number>(3)
    const [targetUser, setTargetUser] = React.useState<number>(0)

    const changeCurrentUser = (e : ChangeEvent<HTMLInputElement>) => {
        setCurrentUser(parseInt(e.target.value))
    }

    const changeTargetUser = (e : Chat) => {
        chats.map(chat => {
            if (chat === e) {
                const user = [...chat.user]; 
                const index = user.indexOf(currentUser);
                user.splice(index, 1);
                setTargetUser(user[0])
            }
        });
    }


    React.useEffect(() => {
        
        const fetchData = async() => {

            const q = query(collection(database, "chat_room"), where("user", "array-contains", currentUser))

            const snapshot = await getDocs(q)
            // console.log(snapshot.docs)
            snapshot.docs.map((shot) => {
                console.log({...shot.data()})
                console.log("ewe ewe")
            })
            console.log("======")
        }

        fetchData()


    }, [currentUser]);

    return (
      <div className='w-screen h-screen bg-background flex justify-around items-center'>
        
        <Navbar pageName="Chat"/>

        <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
            <div className='h-full w-full flex'>
                <div className='w-1/4 h-full overflow-y-auto border-r-3 p-2'>
                    <input placeholder='you' className='border' onChange={changeCurrentUser}/>
                    <input placeholder='target' className='border'/>
                    {
                        chats.map((chat_data, idx) => {
                            return(
                                <div key={idx} className='flex p-2 justify-between items-center flex-wrap cursor-pointer' onClick={() => {
                                    changeTargetUser(chat_data)
                                }} >
                                    <div className='flex h-chat_profile_image_height '>
                                        <Image src={DUMMY_IMAGE} className='h-full aspect-square w-chat_profile_image_width rounded-full' height={500} width={500} alt='missing'/>
                                        <div className='h-full flex flex-wrap items-center ml-2 font-bold text-sm'>
                                            {chat_data.user}   
                                        </div>
                                    </div>
                                    <div className='font-bold text-timeline'>
                                        {DateConverter(chat_data.chat[chat_data.chat.length - 1].timestamp)}
                                    </div>
                                </div> 
                            )
                        })
                    }
                </div>
                <div className='w-3/4 h-full'>
                    {
                        targetUser == 0 ? 
                        <Emptypage/>
                        : 
                        <div className='w-full h-full'>
                            {
                                chats.map((bubble, index) => {
                                    
                                    if(bubble.user.includes(currentUser) && bubble.user.includes(targetUser)){
                                        return(
                                            <div key={index}>
                                                {
                                                    bubble.chat.map((message, idx) => {
                                                        return(
                                                            <div key={idx}>
                                                                {message.message}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }

                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
      </div>
    )
}

export default ChatPage

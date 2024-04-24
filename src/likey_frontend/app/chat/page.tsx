"use client"
import React from 'react'
import Navbar from '../component/navbar';
import Image from 'next/image';
import { CHAT_FRIENDS, DUMMY_IMAGE, DUMMY_NAME } from '../dummy_data';
import { DateConverter } from '../utility/converter';
import { Chat } from '../model';
import { get, ref } from 'firebase/database';
import { database } from '../firebaseConfig';

const ChatPage = () => {

    const [chats, setChats] = React.useState<Chat[]>([])

    React.useEffect(() => {
        const fetchData = async () => {
            const dataRef = ref(database, "chat_data");
            const snapshot = await get(dataRef);
            if (snapshot.exists()) {
                const data: Chat[] = snapshot.val();
                const filteredData = data.filter((chat: Chat) => chat.user.includes(3));
                console.log(filteredData);
                
                setChats(filteredData);
            }
        }
        fetchData();
    }, []);

    return (
      <div className='w-screen h-screen bg-background flex justify-around items-center'>
        
        <Navbar pageName="Chat"/>

        <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
            <div className='h-full w-full flex'>
                <div className='w-1/4 h-full overflow-y-auto'>
                    {/* {
                        CHAT_FRIENDS.map((friend, idx) => {
                            return(
                                <div key={idx} className='flex p-2 justify-between items-center flex-wrap cursor-pointer'>
                                    <div className='flex h-chat_profile_image_height '>
                                        <Image src={friend.profile_image} className='h-full aspect-square w-chat_profile_image_width rounded-full' height={500} width={500} alt='missing'/>
                                        <div className='h-full flex flex-wrap items-center ml-2 font-bold text-sm'>
                                            {friend.name}
                                        </div>
                                    </div>
                                    <div className='font-bold text-timeline'>
                                        {DateConverter(friend.time)}
                                    </div>
                                </div> 
                            )
                        })
                    } */}
                    {
                        chats.map((chat_data, idx) => {
                            return(
                                <div key={idx} className='flex p-2 justify-between items-center flex-wrap cursor-pointer'>
                                    <div className='flex h-chat_profile_image_height '>
                                        <Image src={DUMMY_IMAGE} className='h-full aspect-square w-chat_profile_image_width rounded-full' height={500} width={500} alt='missing'/>
                                        <div className='h-full flex flex-wrap items-center ml-2 font-bold text-sm'>
                                            {DUMMY_NAME}                                        </div>
                                    </div>
                                    <div className='font-bold text-timeline'>
                                        {DateConverter(chat_data.chat[chat_data.chat.length - 1].timestamp)}
                                    </div>
                                </div> 
                            )
                        })
                    }
                </div>
                <div className='bg-blue-200 w-3/4 h-full'>
                    b
                </div>
            </div>
        </div>
      </div>
    )
}

export default ChatPage

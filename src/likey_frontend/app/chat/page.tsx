"use client"
import React, { ChangeEvent } from 'react'
import Navbar from '../component/navbar';
import Image from 'next/image';
import { DUMMY_IMAGE } from '../dummy_data';
import { DateConverter } from '../utility/converter';
import { Chat } from '../model';
import { database } from '../firebaseConfig';
import Emptypage from './emptyPage';
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import ChatBoxPage from './chatPage';

const ChatPage = () => {

    const [chats, setChats] = React.useState<Chat[]>([])
    const [currentUser, setCurrentUser] = React.useState<number>(3)
    const [targetUser, setTargetUser] = React.useState<number>(0)

    const [showChat, setShowChat] = React.useState<Chat>({
        user : [],
        message : [{
            message : "",
            sender : 0,
            timestamp : {
                seconds : 0,
                nanoseconds : 0
            }
        }]
    })

    const changeCurrentUser = (e : ChangeEvent<HTMLInputElement>) => {
        setCurrentUser(parseInt(e.target.value))
        setTargetUser(0)
    }

    const changeTargetUser = (e : Chat) => {
        chats.map(chat => {
            if (chat === e) {
                const user = [...chat.user]; 
                const index = user.indexOf(currentUser);
                user.splice(index, 1);
                console.log(user[0])
                setTargetUser(user[0])
                setShowChat(chat)
            }
        });
    }


    React.useEffect(() => {
        
        const fetchData = async() => {

            const q = query(collection(database, "chat_room"), where("user", "array-contains", currentUser))

            const newData : Chat[] = []

            const unsub = onSnapshot(q, (snapshot) => {
                snapshot.forEach((doc) => {
                    console.log({...doc.data()})
                    newData.push({...doc.data()} as Chat)
                })

                console.log(newData);
            
                setChats(newData)
            })
            
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
                                        {/* {chat_data.message[0].message} */}
                                        {/* {chat_data.chat[0].timestamp} */}
                                        {/* {DateConverter(chat_data.message[chat_data.message.length - 1].timestamp)} */}
                                        {
                                        chat_data.message?
                                        DateConverter(chat_data.message[chat_data.message.length - 1].timestamp.seconds) :
                                        ""}
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
                        <ChatBoxPage chatList={showChat} id={targetUser}/>
                    }
                </div>
            </div>
        </div>
      </div>
    )
}

export default ChatPage

"use client"
import React, { ChangeEvent, useRef } from 'react'
import Navbar from '../component/navbar';
import Image from 'next/image';
import { DUMMY_IMAGE } from '../dummy_data';
import { ChatDateConverter, DateConverter } from '../utility/converter';
import { Chat, UserData } from '../model';
import { database } from '../firebaseConfig';
import Emptypage from './emptyPage';
import { arrayUnion, collection, doc, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { getUserData } from '../utility/userDataController';

const ChatPage = () => {

    const [chats, setChats] = React.useState<Chat[]>([])
    const [user, setUser] = React.useState<UserData>()
    const [targetUser, setTargetUser] = React.useState<string>("")

    const defaultBubbleTailwind = "border rounded-default w-fit p-4"
    const [newMessage, setNewMessage] = React.useState<String>()

    const scrollableContainerRef = useRef<HTMLDivElement>(null);


    const sendMessage = async() => {
        console.log(showChat)
        const docRef = doc(database, 'chat_room', showChat.id)
        await updateDoc(docRef, {
            message : arrayUnion({
                message : newMessage,
                sender : user?.user_id.join(''),
                timestamp : new Date()
            })
        })
    }

    const [showChat, setShowChat] = React.useState<Chat>({
        id: "",
        user : [],
        message : [{
            message : "",
            sender : "",
            timestamp : {
                seconds : 0,
                nanoseconds : 0
            }
        }]
    })

    const changeTargetUser = (e : Chat) => {

        let found = false

        chats.map(chat => {
            if (chat === e) {
                const userData = [...chat.user]; 
                const find = user?.user_id.join('') || ''
                const index = userData.indexOf(find);
                userData.splice(index, 1);
                setTargetUser(userData[0])
                found = true

                const fetchData = async() => {

                    const db = getFirestore()
                    const docRef = doc(db, "chat_room", chat.id)
        
                    const unsub = onSnapshot(docRef, (doc) => {  
                        setShowChat({id : doc.id, ...doc.data()} as Chat)
                    })
                    
                }
                fetchData()

            }
        });
        if(!found){
            setTargetUser("")
        }
    }


    React.useEffect(() => {
        const fetchData = async() => {

            // let cook = await dec(getCookie("my_principal_id")||"")
            // console.log(cook)

            // // nembak ID karena tidak bisa akses II punya ID
            // let afterParse = JSON.parse(cook||"{}")
            // console.log(afterParse)
            let afterParse = [1]
            const userData : any = await getUserData(afterParse)
            // console.log(userData)

            // const userData:any = await getUserDataFromStorage()
            console.log("DALAM NAMA TUHAN YESUS")
            console.log(userData.Ok)
            
            setUser(userData.Ok)

            const q = query(collection(database, "chat_room"), where("user", "array-contains", user));
            
           onSnapshot(q, (snapshot) => {
                const newData: Chat[] = [];
                snapshot.forEach((doc) => {
                    newData.push({ id: doc.id, ...doc.data() } as Chat);
                }); 
                console.log(newData)
                setChats(newData)
            });

            

        }
        fetchData();
    }, []);

    React.useEffect(() => {
        if (scrollableContainerRef.current) {
          scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
        }
      }, [showChat]);

    return (
      <div className='w-screen h-screen bg-background flex justify-around items-center'>
        
        <Navbar pageName="Chat"/>

        <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
            <div className='h-full w-full flex'>
                <div className='w-1/4 h-full overflow-y-auto  p-2'>
                    {/* <input placeholder='you' className='border' onChange={changeCurrentUser}/>
                    <input placeholder='target' className='border'/> */}
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
                <div className='w-3/4 h-full border-l-3'>
                    {
                        targetUser == "" ? 
                        <Emptypage/>
                        : 
                        <div className='w-full h-full'>
            
                            <div className='h-fit_screen overflow-y-auto overflow-x-hidden p-2' ref={scrollableContainerRef}>
                                {showChat.message?.map((bubble, index) => {

                                    const senderGender = "Male" as string
                                    let senderBackgroundColor
                                    let receiveBackgrounColor
                                    if(senderGender == "Female"){
                                        senderBackgroundColor = "bg-girl"
                                        receiveBackgrounColor = "bg-boy"
                                    }
                                    else{
                                        senderBackgroundColor = "bg-boy"
                                        receiveBackgrounColor = "bg-girl"
                                    }

                                    let color
                                    if(bubble.sender != user?.user_id.join('')){
                                        return(
                                            <div key={index} className='m-2 flex '>
                                                <div className={`${defaultBubbleTailwind} ${receiveBackgrounColor}`}>
                                                    {bubble.message}
                                                </div>
                                                <div className='flex items-center flex-wrap ml-2'>
                                                    {ChatDateConverter(bubble.timestamp.seconds)}
                                                </div>
                                            </div>
                                        )
                                    }
                                    else{
                                        return(
                                            <div key={index} className='m-2 flex w-full justify-end'>
                                                <div className='flex items-center flex-wrap mr-2'>
                                                    {ChatDateConverter(bubble.timestamp.seconds)}
                                                </div>
                                                <div className={`${defaultBubbleTailwind} ${senderBackgroundColor}`}>
                                                    {bubble.message}
                                                </div>    
                                            </div>
                                        )
                                    }
                                    })}
                            </div>
                            
                            <div className='h-rest_screen mx-3 w-full flex justify-around'>
                                <input type="text" className='h-full p-2 w-fit_screen border-3 rounded-default' onChange={(e) => {setNewMessage(e.target.value)}}/>
                                <button className='w-rest_screen border-3 border-border_placeholder bg-main rounded-default px-4' onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
      </div>
    )
}

export default ChatPage

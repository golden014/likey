import React from 'react'
import { Chat } from '../model'
import { ChatDateConverter } from '../utility/converter'

const ChatBoxPage = ({chatList, id} : {chatList : Chat , id : number}) => {

    const defaultBubbleTailwind = "border rounded-default w-fit p-4"

    return (
        <div className='w-full h-full'>
            {
                chatList.message?.map((bubble, index) => {

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
                    if(bubble.sender == id){
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
                })
            }
        </div>
    )
}

export default ChatBoxPage
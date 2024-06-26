import React, { ChangeEvent } from 'react'

const InterestPage = ({ onChanges, goNext, name, list } : {onChanges: (name : string) => void, goNext: () => void, name : string, list : string[]}) => {
    
    const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
        onChanges(event.target.name)
    }

    return (
        <div className='w-screen h-screen flex flex-col justify-around items-center flex-nowrap bg-white'>
            <div className='font-bold flex flex-wrap text-title justify-start h-1/4 items-end p-6 w-full'>
                Add Your Hobbies
            </div>
            <div className=' h-1/2 w-4/5'>
                <div className='w-full flex justify-center text-title font-bold'>
                    {name}
                </div>
                <div className='grid grid-cols-3'>
                    {
                        list.map((datum) => {
                            return(
                                <div key={datum} className='h-fit pt-2 ml-32'>
                                    <input name={datum} type='checkbox'id={datum} onChange={handleChange}></input>
                                    <label htmlFor={datum} className='pl-2'>{datum}</label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='w-1/5 h-1/4 flex justify-center flex-nowrap items-center'>
                <button onClick={goNext} className='w-full h-auth_form_input bg-main rounded-default shadow-xl'>Join Likey</button>
            </div>
        </div>
    );
}

export default InterestPage

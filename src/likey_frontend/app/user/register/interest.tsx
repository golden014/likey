import React from 'react'

const InterestPage = ({ onChanges, goNext, name, list } : {onChanges: (value: string) => void, goNext: () => void, name : string, list : string[]}) => {
    
    const handleChange = (event : string) => {
        onChanges(event)
    }

    return (
        <div className='w-screen h-screen flex flex-col justify-around items-center flex-nowrap bg-white'>
            <div className='font-bold flex flex-wrap text-title justify-start h-1/4 items-end p-6 w-full'>
                Add Your Interest
            </div>
            <div className=' h-1/2 w-4/5'>
                <div className='grid grid-cols-3'>
                    {
                        list.map((datum) => {
                            return(
                                <div key={datum} className='h-fit pt-2'>
                                    <input type='checkbox'id={datum}></input>
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

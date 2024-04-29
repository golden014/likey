import { EDUCATIONS, GENDERS, RELIGIONS } from '@/app/data';
import React, { useState, ChangeEvent } from 'react';

const Biodata = ({ onChanges, goNext } : {onChanges: (fieldName: string, value: string) => void, goNext: () => void}) => {

    const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        onChanges(name, value)
    }

    const handleDropdownChange = (event : ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target
        onChanges(name, value)
    }

    return (
        <div className='w-screen h-screen flex flex-col justify-around items-center flex-nowrap bg-white'>
            <div className='font-bold flex flex-wrap text-title justify-start h-1/4 items-end p-6 w-full'>
                Add Your Biodata
            </div>
            <div className='grid grid-rows-3 grid-cols-2 h-1/2 w-4/5'>
                <div className='flex flex-col w-4/5'>
                    <label htmlFor="first_name" className='font-bold pl-3'>First Name</label>
                    <input onChange={handleChange} name='first_name' id='first_name' type="text" className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2' placeholder='First Name' />
                </div>
                <div className='flex flex-col w-4/5'>
                    <label htmlFor="last_name" className='font-bold pl-3'>Last Name</label>
                    <input onChange={handleChange} name='last_name' id='last_name' type="text" className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2' placeholder='Last Name' />
                </div>
                <div className='flex flex-col w-4/5'>
                    <label htmlFor="height" className='font-bold pl-3'>Height</label>
                    <input onChange={handleChange} name='height' id='height' type="number" defaultValue={120} min={100} max={210} className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2' placeholder='Height' />
                </div>
                <div className='flex flex-col w-4/5'>
                    <label htmlFor="gender" className='font-bold pl-3'>Gender</label>
                    <select onChange={handleDropdownChange} name="gender" id="gender" className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2 appearance-none'>
                        {
                            GENDERS.map((gender) => {
                                return(
                                    <option key={gender} value={gender}>{gender}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className='flex flex-col w-4/5'>
                    <label htmlFor="religion" className='font-bold pl-3'>Religion</label>
                    <select onChange={handleDropdownChange} name="religion" id="religion" className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2 appearance-none'>
                        {
                            RELIGIONS.map((religion) => {
                                return(
                                    <option key={religion} value={religion}>{religion}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className='flex flex-col w-4/5'>
                    <label htmlFor="education" className='font-bold pl-3'>Education</label>
                    <select onChange={handleDropdownChange} name="education" id="education" className='border-3 w-full h-auth_form_input border-border_placeholder bg-background shadow-xl rounded-default px-2 appearance-none'>
                        {
                            EDUCATIONS.map((education) => {
                                return(
                                    <option key={education} value={education}>{education}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            <div className='w-1/5 h-1/4 flex justify-center flex-nowrap items-center'>
                <button onClick={goNext} className='w-full h-auth_form_input bg-main rounded-default shadow-xl'>Join Likey</button>
            </div>
        </div>
    );
}

export default Biodata;

import Image from 'next/image';
import React, { useState, ChangeEvent } from 'react';

const PhotoUpload = ({goNext } : {goNext: () => void}) => {
    const [selectedImages, setSelectedImages] = useState<(File | null)[]>(Array(6).fill(null));

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const newImages = [...selectedImages];
        newImages[selectedImages.filter(image => image !== null).length] = file;
        setSelectedImages(newImages);
        }
    };

    return (
        <div className='w-screen h-screen flex flex-col justify-around items-center flex-nowrap bg-white'>
            <div className='font-bold flex flex-wrap text-title justify-start h-1/4 items-end p-6 w-full'>
                Add Photo&apos;s
            </div>
            <div className='grid grid-rows-2 grid-cols-3 h-1/2'>
                {selectedImages.map((image, index) => (
                    <div key={index} className='h-photo_form_input w-photo_form_input border-3 border-border_placeholder bg-background mx-3 my-3 flex items-center justify-center flex-nowrap rounded-default shadow-2xl'>
                        {image == null ? <label htmlFor={`imageUpload${index}`} className='cursor-pointer w-full h-full flex justify-center items-center'>
                            +
                        </label> : ""}
                        <input
                            id={`imageUpload${index}`}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className='hidden'
                        />
                        {image && (
                            <Image
                            src={URL.createObjectURL(image)}
                            alt={`Selected ${index}`}
                            width={180}
                            height={180}
                            className='aspect-square rounded-default'
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className='w-1/5 h-1/4 flex justify-center flex-nowrap items-center'>
                <button onClick={goNext} className='w-full h-auth_form_input bg-main rounded-default shadow-xl'>Join Likey</button>
            </div>
        </div>
    );
}

export default PhotoUpload;

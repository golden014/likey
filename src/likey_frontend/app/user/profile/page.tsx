"use client"
import { useEffect, useState } from "react";
import { UserData } from "../model";
import { EDUCATIONS } from "@/app/data";

const ProfilePage: any = () => {

    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        //TODO - wait for auth
        const fetchUserData = () => {
            //dummy
            const dummy: UserData = {
                user_id: 1,
                email: "josua@email.com",
                first_name: "Josua",
                last_name: "Golden",
                height: 200,
                gender: "Male",
                education: 4,
                religion: "Christian",
                description: "this is description",
                profile_picture_link: "https://picsum.photos/id/237/200/300",
                photo_link: ["https://picsum.photos/200/300", "https://picsum.photos/200/300", "https://picsum.photos/200/300", "https://picsum.photos/200/300"],
                likey_coin: 100,
                current_swipe: 30,
                filter_access: false,
                hobby: ["Badminton", "Movies", "Ur Mom", "Basketball"]
            }

            setUser(dummy);
        }

        fetchUserData();
    });

    return (
        <div> 
            { user ? (
                <div className="w-screen h-screen flex flex-col justify-center items-center">
                    <div className="h-30vh w-full flex justify-around items-center bg-white">
                        <div className="h-500 v-500">
                            <img className="rounded-full" src={user.profile_picture_link} alt="Trust me this is a Profile Picture" />
                        </div>
                        
                        <div className="">
                            <p className="text-black">{user.first_name} {user.last_name}</p>
                            <p className="text-black">{user.gender}</p>
                            <p className="text-black">{user.height}cm / {user.religion}</p>
                            <p className="text-black">{EDUCATIONS[user.education]}</p>
                            <p className="text-black">{user.description}</p>
                        </div>
                    </div>

                    <div className="h-70vh w-full">
                        <div className="photos_profile_page">
                           {/* {user.photo_link.map((photo_link, index) =>(
                                <img className="photo_carousel_profile_page" key={index} src={photo_link} alt={`Photo ${index}`} />
                           ))} */}
                        </div>
                        <div className="interests_profile_page">
                            {/* TODO - hobby/interest nya nnti dibuat jadi component aja biar enak, satu component yg terima list of strings 
                            utk ngemap tiap hobby, satu utk buat card hobby/interest nya */}
                            {user.hobby.map((hobby, index) => (
                                <p key={hobby}>{hobby}</p>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>No User Data</p>
            )}
        </div>
    );
}

export default ProfilePage

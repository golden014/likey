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
                <div className="profile_page_container">
                    <div className="profile_page_top">
                        <div className="profile_picture_profile_page">
                            <img src={user.profile_picture_link} alt="Trust me this is a Profile Picture" />
                        </div>
                        <div className="profile_page_top_right">
                            <h1 className="name_title_profile_page">{user.first_name} {user.last_name}</h1>
                            <h2 className="gender_profile_page">{user.gender}</h2>
                            <h3 className="misc_profile_page">{user.height}cm / {user.religion}</h3>
                            <h3 className="misc_profile_page">{EDUCATIONS[user.education]}</h3>
                            <p className="description_profile_page">{user.description}</p>
                        </div>
                    </div>

                    <div className="profile_page_bot">
                        <div className="photos_profile_page">
                           {user.photo_link.map((photo_link, index) =>(
                                <img className="photo_carousel_profile_page" key={index} src={photo_link} alt={`Photo ${index}`} />
                           ))}
                        </div>
                        <div className="interests_profile_page">
                            {/* TODO - hobby/interest nya nnti dibuat jadi component aja biar enak, satu component yg terima list of strings 
                            utk ngemap tiap hobby, satu utk buat card hobby/interest nya */}
                            {user.hobby.map((hobby, index) => (
                                <p>{hobby}</p>
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

export interface RegisterDataType{
    first_name : string,
    last_name : string,
    height : number,

    gender : string,
    education : number,
    religion : string,
    description : string,
    hobbies : string[]
}
// Education: {data: number},
// Religion: {data: String},
// Height: {data_start: number, data_end: number},
// Age: {data_start: number, data_end: number}

// type FilterAttributeGender = {
//     Gender: {data: String} 
// }
// type FilterAttributeEducation = {
//     Education: {data: number}
// }
// type FilterAttributeReligion = {
//     Religion: {data: String}
// }
// type FilterAttributeHeight = {
//     Height: {data_start: number, data_end: number},
// }
// type FilterAttributeAge = {
//     Age: {data_start: number, data_end: number}
// }

type FilterAttribute =
| { Age: { data_start: number; data_end: number } }
| { Height: { data_start: number; data_end: number } }
| { Religion: { data: string } }
| { Gender: { data: string } }
| { Education: { data: number } };

export interface UserPayloadData {
    user_principal_id: number[],
    first_name: string,
    last_name: string,
    height: number,
    gender: string,
    education: number,
    religion: string,
    description: string,
    profile_picture_link: string,
    photo_link: string[] ,
    likey_coin: number,
    current_swipe: number,
    filter_access: boolean,
    // swipe_filters:[[string, FilterAttributeAge],[string, FilterAttributeHeight],[string, FilterAttributeReligion],[string, FilterAttributeGender],[string, FilterAttributeEducation]],
    swipe_filters: [string, FilterAttribute][];
    dob: string,
    last_swipe_index: number
} 

export interface Hobby {
    user_id: number[],
    name: string[],
} 

export interface UserData{
    user_id: number[],
    email: string,
    first_name: string,
    last_name: string,
    height: number,
    gender: string,
    education: number,
    religion: string,
    description: string,
    profile_picture_link: string,
    photo_link: string[],
    likey_coin: number,
    current_swipe: number,
    filter_access: boolean,
    last_swipe_index: number
}

export interface HobbyPayload{
    user_id: number[],
    name: string
}

export interface Chat{
    id : string,
    user : number[],
    message : [{
        message : string,
        sender : number,
        timestamp : {
            seconds : number,
            nanoseconds : number
        }
    }]
}

export interface UpdateUserPayload{
    first_name: string,
    last_name: string,
    height: number,
    education: number,
    religion: string,
    description: string,
    profile_picture_link: string,
    photo_link:string[]
}

export interface UpdateUserCoinPayload{
    likey_coin: number
}

export interface FeedProfile {
    dob: string;
    height: number;
    profile_picture_link: string;
    education: number;
    description: string;
    user_id: number[];
    gender: string;
    first_name: string;
    last_name: string;
    religion: string;
    photo_link: string[];
}

export interface UserHobby {
    name : string,
    user_id : number[]
}
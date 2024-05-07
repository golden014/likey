export interface RegisterDataType{
    email : string,
    password : string,
    first_name : string,
    last_name : string,
    height : number,

    gender : string,
    education : number,
    religion : string,
    description : string,
    hobbies : string[]
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
    hobby: string[]
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
    profile_picture_link: string
}
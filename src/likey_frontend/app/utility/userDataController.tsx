import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { likey_backend } from "../../../declarations/likey_backend"
import { enc, dec } from "./cryptController";


export const getUserDataFromDB = async (id : number[]) => {
    console.log("userDataController line 7", id)
    const data = await likey_backend.get_user(id)
    console.log(data)

    if(Object.keys(data)[0] != "Ok"){
        console.log("line 12 udc", id)
        const serializedValue = await enc(JSON.stringify(id));
        setCookie("my_principal_id", serializedValue);
        setCookie("wswsws", "aaaa");

        return null
    }

    if(data != null){
        deleteCookie("user-data")
        if(Object.keys(data)[0] == "Ok"){
            let input = await enc(JSON.stringify(Object.values(data)[0]))
            setCookie("user-data",input)
        }
    }
    

    return data
}

export const getUserDataFromStorage = async () => {
    let cook = await dec(getCookie("user-data") || "")
    return JSON.parse(cook || "{}")
}

export const getUserData = async(id : number[]) => {
    const data= await likey_backend.get_user(id)
    return data
}

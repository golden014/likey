import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { likey_backend } from "../../../declarations/likey_backend"
import { enc, dec } from "./cryptController";


export const getUserDataFromDB = async (id : number[]) => {
    console.log(id)
    const data = await likey_backend.get_user(id)

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

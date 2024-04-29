import { likey_backend } from "../../../declarations/likey_backend"
import secureLocalStorage from "react-secure-storage";

export const getUserDataFromDB = async (id : number[]) => {
    const data = await likey_backend.get_user(id)

    if(data != null){
        secureLocalStorage.clear();
        if(Object.keys(data)[0] == "Ok"){
            secureLocalStorage.setItem("userData",Object.values(data)[0]);
        }
    }

    return data
}

export const getUserDataFromStorage = () => {
    return secureLocalStorage.getItem("userData")
}

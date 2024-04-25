import { likey_backend } from "../../../declarations/likey_backend"
import secureLocalStorage from "react-secure-storage";

export const getUserDataFromDB = async (id : string) => {
    const data = await likey_backend.get_user_by_principal_id(id)

    if(data != null){
        secureLocalStorage.clear();
        if(Object.keys(data)[0] == "Ok"){
            var user = Object.values(data)[0]
            user['user_id'] = user['user_id'].toString()
            secureLocalStorage.setItem("userData",user);
        }
    }

    return data
}

export const getUserDataFromStorage = () => {
    return secureLocalStorage.getItem("userData")
}

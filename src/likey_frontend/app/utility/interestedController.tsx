import { likey_backend } from "../../../declarations/likey_backend"

export const getUserInterested = async(id : number[]) => {
    const data = await likey_backend.get_interested_history(id)
    return data
}
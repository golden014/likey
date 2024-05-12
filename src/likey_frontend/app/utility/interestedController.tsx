import { likey_backend } from "../../../declarations/likey_backend"

export const getUserInterested = async(id : number[]) => {
    const data = await likey_backend.get_all_interest_by_user_id(id)
    return data
}
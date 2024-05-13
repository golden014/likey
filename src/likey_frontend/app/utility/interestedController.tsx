import { likey_backend } from "../../../declarations/likey_backend"

export const getUserInterested = async(id : number[]) => {
    const data = await likey_backend.get_all_interest_and_users_by_user_id(id)
    return data
}

export const buyReveal = async(srcId : number[], dstId : number[]) => {

    const payload = {
        user_id_source : dstId,
        user_id_destination : srcId,
        is_revealed : true
    }

    console.log(payload)

    const data = await likey_backend.update_reveal(payload)
    return data
}
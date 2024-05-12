import { likey_backend } from "../../../declarations/likey_backend"

export const getFeeds = async(id : number[]) => {
    const data = await likey_backend.get_feeds(id)
    return data
}

export const getHobby = async(id : number[]) => {
    const data = await likey_backend.get_all_hobby_by_user_id(id)
    return data
}

export const addInterest = async(srcId : number[], dstId : number[], isInterest : boolean) => {

    const payload = {
        user_id_source : srcId,
        user_id_destination : dstId,
        is_interested : isInterest
    }

    const test = await likey_backend.add_interest(payload)
    return test
}
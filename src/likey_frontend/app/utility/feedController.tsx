import { likey_backend } from "../../../declarations/likey_backend"
import { AddInterestPayload } from "../../../declarations/likey_backend/likey_backend.did"

export const getFeeds = async(id : number[]) => {
    const data = await likey_backend.get_feeds(id)
    return data
}

export const getHobby = async(id : number[]) => {
    const data = await likey_backend.get_all_hobby_by_user_id(id)
    return data
}

export const addInterest = async(srcId : any, dstId : number[], isInterest : boolean) => {

    const payload : AddInterestPayload = {
        user_id_source : srcId,
        user_id_destination : dstId,
        is_interested : isInterest
    }

    console.log(payload)

    const test = await likey_backend.add_interest(payload)
    return test
}

// export interface AddInterestPayload {
//     'user_id_source' : Uint8Array | number[],
//     'user_id_destination' : Uint8Array | number[],
//     'is_interested' : boolean,
//   }
import { likey_backend } from "../../../declarations/likey_backend"

export const updateSwipeFilter = async(id : number[], filter : any) => {
    const data = await likey_backend.update_swipe_filter(id, filter)
    return data
}
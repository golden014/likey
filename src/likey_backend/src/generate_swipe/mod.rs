
//generate swipe -> generate a vector of user id's (size: the user's current swipe), 
//the vector must be filtered based on age, religion, hobbies
//additional constraint: the vector must only contain new people (the one that never been swapped before) -> check from interest

use ic_stable_structures::storable::Blob;

use crate::{Error, FilterAttribute, User, _get_user, date_helper::{self, get_age}, SwipePool, SWIPE_POOL_STORAGE, USER_STORAGE};


pub(crate) fn generate_swipe(user_id: &Vec<u8>) -> Option<Vec<Vec<u8>>>{

    //TODO: tambahin constraint filter access

    //get the user object
    let curr_user = _get_user(&user_id);

    match curr_user {
        Some(curr_user) => {
            //get the swipe filters of the user
            let swipe_filters = curr_user.swipe_filters;

            //from USER_STORAGE, filter all the user that match the given criteria (from swipe filters)
            let filters_from_user_object: Vec<(Blob<29>, User)> =  USER_STORAGE.with(|s| {
                s.borrow().iter().filter(|(_id, user)| {
                    swipe_filters.iter().all(|(_key, value)| match value {

                        FilterAttribute::Gender{ data } => {
                            data.is_empty() || user.gender == *data
                        },

                        FilterAttribute::Education { data } => {
                            *data == 0 || user.education == *data
                        },

                        FilterAttribute::Religion { data } => {
                            data.is_empty() || user.religion == *data
                        },

                        //the height of the user must be inside of the specified range
                        FilterAttribute::Height { data_start, data_end } => {
                            (*data_start == 0 && *data_end == 0) || (user.height >= *data_start && user.height <= *data_end)
                        },

                        FilterAttribute::Age {data_start, data_end } => {
                            (*data_start == 0 && *data_end == 0) || {
                                let dob = user.dob.clone();
                                //age must be inside of the specified range
                                get_age(&dob) >= *data_start && get_age(&dob) <= *data_end
                            }
                        },
                    })
                }).collect::<Vec<_>>()
        
            });

            //create vectors of id's from the vector of Blob, User
            let vec_without_user: Vec<Vec<u8>> = filters_from_user_object.into_iter().map(|(_, user)| user.user_id).collect();

            //get current date
            let curr_date = date_helper::get_current_date();

            //insert new swipe pool
            match insert_to_swipe_pool(curr_user.user_id, vec_without_user, curr_date) {
                Some(swipe_pool) => Some(swipe_pool.user_ids),
                None => None
            }
        },

        None => return None,
    }

    

}

fn insert_to_swipe_pool(owner_id: Vec<u8>, user_ids: Vec<Vec<u8>>, date: String) -> Option<SwipePool>{
    
   let new_swipe_pool = SwipePool{ owner_id: owner_id, user_ids: user_ids, date: date};
    
    match SWIPE_POOL_STORAGE.with(|s| {
        s.borrow_mut().push(&new_swipe_pool)
    }) {
        Ok(_) => return Some(new_swipe_pool),
        Err(_) => return None,
    }
}

//generate swipe -> generate a vector of user id's (size: the user's current swipe), 
//the vector must be filtered based on age, religion, hobbies
//additional constraint: the vector must only contain new people (the one that never been swapped before) -> check from interest

use ic_stable_structures::storable::Blob;

use crate::{Error, FilterAttribute, User, _get_user, date_helper::get_age, USER_STORAGE};


pub(crate) fn generate_swipe(user_id: Vec<u8>) -> Result<Option<Vec<Vec<u8>>>, Error>{

    let curr_user = _get_user(&user_id);

    if curr_user.is_none() {
        return Result::Err(Error::NotFound { msg: "Invalid user ID".to_string() });
    }

    let swipe_filters = curr_user.unwrap().swipe_filters;

    //filters:
    //dari object user
    //user - gender harus berlawanan arah dengan curr user's gender
    //user - education
    //user - religion
    //user - height (masuk ke range yg dimau oleh user)
    //user - age

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
                        get_age(&dob) >= *data_start && get_age(&dob) <= *data_end
                    }
                },
            })
        }).collect::<Vec<_>>()
    });

    let vec_without_user: Vec<Vec<u8>> = filters_from_user_object.into_iter().map(|(_, user)| user.user_id).collect();

    
    //dari object hobby
    

        return Result::Ok(Some(vec_without_user));

}

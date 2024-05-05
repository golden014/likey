
//generate swipe -> generate a vector of user id's (size: the user's current swipe), 
//the vector must be filtered based on age, religion, hobbies
//additional constraint: the vector must only contain new people (the one that never been swapped before) -> check from interest

use crate::{Error, User, _get_user, HOBBY_STORAGE};



fn generate_swipe(user_id: Vec<u8>) -> Result<Option<Vec<Vec<u8>>>, Error>{

    let curr_user = _get_user(&user_id);

    if curr_user.is_none() {
        return Result::Err(Error::NotFound { msg: "Invalid user ID".to_string() });
    }

    let swipe_filters = curr_user.unwrap().swipe_filters;

    //next step: bikin vectors of user ids yang match dengan filter yang ada

    //filters:
    //dari object user
    //user - gender harus berlawanan arah dengan curr user's gender
    //user - education
    //user - religion
    //user - height (masuk ke range yg dimau oleh user)
    //user - age
    
    //dari object hobby
    //

    
    //TODO: bikin filter nya utk religion, age, dll
    return Result::Ok(None);

}

// fn filter_by_hobbies(hobbies: Vec<String>) -> Option<Vec<Vec<u8>>> {
//     HOBBY_STORAGE.with(|m|) {
        
//     }
// }


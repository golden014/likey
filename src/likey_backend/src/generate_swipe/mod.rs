
//generate swipe -> generate a vector of user id's (size: the user's current swipe), 
//the vector must be filtered based on age, religion, hobbies
//additional constraint: the vector must only contain new people (the one that never been swapped before) -> check from interest

use crate::{Error, User, _get_user};



fn generate_swipe(user_id: Vec<u8>) -> Result<Option<Vec<Vec<u8>>>, Error>{

    //get user's current swipe
    let current_user_swipe_limit = match _get_user(&user_id) {
        Some(user) => user.current_swipe,
        None => -1
    };

    //jka gadapat user id nya -> invaid user ID
    if current_user_swipe_limit == -1 {
        return Result::Err(Error::NotFound { msg: "Invalid user ID".to_string() });
    }
    
    //TODO: bikin filter nya utk religion, age, dll
    return Result::Ok(None);

}


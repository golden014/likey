use crate::_get_user;

pub(crate) fn coin_sufficient(user_id: &Vec<u8>, coin_need: i32) -> bool {
    let user = _get_user(user_id);

    match user {
        Some(user) => {
            if user.likey_coin >= coin_need {
                return true
            }
            return false
        },
        None => return false
    }
}
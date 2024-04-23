#[macro_use]
extern crate serde;
extern crate argon2;
use candid::{Decode, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, Cell, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};
use regex::Regex;
use std;
// use argon2::{
//     password_hash::{
//         rand_core::OsRng,
//         PasswordHash, PasswordHasher, PasswordVerifier, SaltString
//     },
//     Argon2
// };
use argon2::{Config};

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdCell = Cell<u64, Memory>;

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
struct User {
    user_id: u64,
    user_email: String,
    user_password: String,
    first_name: String,
    last_name: String,
    height: i32,
    gender: String,
    education: i32,
    religion: String,
    description: String,
    profile_picture_link: String,
    photo_link: Vec<String>,
    likey_coin: i32,
    current_swipe: i32,
    filter_access: bool,
}

impl Storable for User {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for User {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static USER_ID_COUNTER: RefCell<IdCell> = RefCell::new(
        IdCell::init(MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))), 0)
            .expect("Cannot create a user ID counter")
    );

    static USER_STORAGE: RefCell<StableBTreeMap<u64, User, Memory>> =
        RefCell::new(StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
    )); 
}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct UserPayload {
    user_email: String,
    user_password: String,
    first_name: String,
    last_name: String,
    height: i32,
    gender: String,
    education: i32,
    religion: String,
    description: String,
    profile_picture_link: String,
    photo_link: Vec<String>,
    likey_coin: i32,
    current_swipe: i32,
    filter_access: bool
}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct UserProfilePayload {
    first_name: String,
    last_name: String,
    height: i32,
    education: i32,
    religion: String,
    description: String,
    profile_picture_link: String
}

#[derive(candid::CandidType, Deserialize, Serialize)]
enum Error {
    NotFound { msg: String },
    InvalidPayloadData {msg: String}
}

#[derive(candid::CandidType, Deserialize, Serialize)]
enum UniqueAttribue{
    UserEmail
}

fn attribute_unique_validation(data: &String, attribute: UniqueAttribue) -> bool {
    let is_unique: bool = !USER_STORAGE.with(|s| {
        s.borrow().iter().any(|(_, user_data)| {
            match attribute {
                UniqueAttribue::UserEmail => user_data.user_email == *data,
            }
        })
    });

    is_unique
}

#[ic_cdk::update]
fn create_user(data: UserPayload) -> Result<Option<User>, Error> {
    //validate new user's data
    let user_data_valid = create_user_validation(&data);

    if user_data_valid == false {
        return Result::Err(Error::InvalidPayloadData { msg: "Invalid data, make sure the email is in valid format, email and username must be unique".to_string() })
    }

    //get the new id
    let id = USER_ID_COUNTER
        .with(|counter| {
            let current_value = *counter.borrow().get();
            counter.borrow_mut().set(current_value + 1)
        })
        .expect("cannot increment id counter");

    let password = data.user_password.as_bytes();
    let salt = b"randomsalt";
    let config = Config::default();
    let hash = argon2::hash_encoded(password, salt, &config).unwrap();

    let new_user = User {
        user_id: id,
        user_email: data.user_email,
        user_password: hash,
        first_name: data.first_name,
        last_name: data.last_name,
        height: data.height,
        gender: data.gender,
        education: data.education,
        religion: data.religion,
        description: data.description,
        profile_picture_link: data.profile_picture_link,
        photo_link: data.photo_link,
        likey_coin: 0,
        current_swipe: data.current_swipe,
        filter_access: data.filter_access,
    };

    //insert new User
    let insert_success = do_insert_user(&new_user);

    match insert_success {
        true => return Result::Ok(Some(new_user)),
        false => return Result::Err(Error::NotFound { msg: "error while inserting new user".to_string() })
    }

}

fn create_user_validation(data: &UserPayload) -> bool {
    //email format validation using regex
    let email_format = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();

    //check if the email matches the regex
    let email_format_valid = email_format.is_match(&data.user_email);

    
    //check if email and username is unique
    let email_unique = attribute_unique_validation(&data.user_email, UniqueAttribue::UserEmail); 
    

    return email_format_valid && email_unique;
}

fn do_insert_user(data: &User) -> bool {
    let a = USER_STORAGE.with(|service| service.borrow_mut().insert(data.user_id, data.clone()));
    match  a {
        Some(_user) => return false,
        None => return true,
    }
}

fn _get_user(id: &u64) -> Option<User> {
    USER_STORAGE.with(|service| service.borrow().get(id))
}

#[ic_cdk::query]
fn get_user(id: u64) -> Result<User, Error> {
    match _get_user(&id) {
        Some(user) => Ok(user),
        None => Err(Error::NotFound {
            msg: format!("a user with id={} not found", id),
        }),
    }
}

#[ic_cdk::update]
fn update_user(id: u64, data: UserProfilePayload) -> Result<User, Error> {
    match USER_STORAGE.with(|service| service.borrow().get(&id)) {
        Some(mut u) => {
            u.first_name= data.first_name;
            u.last_name= data.last_name;
            u.height= data.height;
            u.education= data.education;
            u.religion= data.religion;
            u.description= data.description;
            u.profile_picture_link= data.profile_picture_link;
            do_insert_user(&u);
            Ok(u)
        }
        None => Err(Error::NotFound {
            msg: format!(
                "couldn't update user with id={}. user not found",
                id
            ),
        }),
    }
}

ic_cdk::export_candid!();
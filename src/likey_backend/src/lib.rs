#[macro_use]
extern crate serde;
extern crate argon2;
use candid::{Decode, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::storable::Blob;
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable, StableVec};
use chrono::prelude::*;
// use serde::de::IntoDeserializer;
// use std::ptr::null;
use std::{borrow::Cow, cell::RefCell};
// use regex::Regex;
use std::{self, result};
// use argon2::{
//     password_hash::{
//         rand_core::OsRng,
//         PasswordHash, PasswordHasher, PasswordVerifier, SaltString
//     },
//     Argon2
// };
// use argon2::{Config};

//module generate swipe
pub mod generate_swipe;

type Memory = VirtualMemory<DefaultMemoryImpl>;
// type IdCell = Cell<u64, Memory>;

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
struct User {
    user_id: Vec<u8>,
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

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
struct SwipePool {
    owner_id: Vec<u8>,
    user_ids: Vec<Vec<u8>>,
    date: String
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
struct Hobby {
    user_id: Vec<u8>,
    name: String,
}

impl Storable for User {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for SwipePool {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for Hobby {
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

impl BoundedStorable for SwipePool {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

impl BoundedStorable for Hobby {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    // static USER_ID_COUNTER: RefCell<Cell<u64, Memory>> = RefCell::new(
    //     Cell<u64, Memory>::init(MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))), 0)
    //         .expect("Cannot create a user ID counter")
    // );

    static USER_STORAGE: RefCell<StableBTreeMap<Blob<29>, User, Memory>> =
        RefCell::new(StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
    )); 

    static SWIPE_POOL_STORAGE: RefCell<StableBTreeMap<Blob<29>, SwipePool, Memory>> =
        RefCell::new(StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
    ));

    //pakai stableVec soalnya hobby storage gapakai key, tapi dia return nya result yg bisa jadi error, jadi perlu dipasangin unwrap
    static HOBBY_STORAGE: RefCell<StableVec<Hobby, Memory>> = 
        RefCell::new(StableVec::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3)))
    ).unwrap_or_else(|_| panic!("Failed to initialize Hobby Storage")));

}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct UserPayload {
    user_principal_id: Vec<u8>,
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

// #[derive(candid::CandidType, Deserialize, Serialize)]
// enum UniqueAttribue{
//     UserEmail
// }

// fn attribute_unique_validation(data: &String, attribute: UniqueAttribue) -> bool {
//     let is_unique: bool = !USER_STORAGE.with(|s| {
//         s.borrow().iter().any(|(_, user_data)| {
//             match attribute {
//                 UniqueAttribue::UserEmail => user_data.user_email == *data,
//             }
//         })
//     });

//     is_unique
// }

#[ic_cdk::update]
fn create_user(data: UserPayload) -> Result<Option<User>, Error> {

    //validate new user's data
    // let user_data_valid = create_user_validation(&data);

    // if user_data_valid == false {
    //     return Result::Err(Error::InvalidPayloadData { msg: "Invalid data, make sure the email is in valid format, email and username must be unique".to_string() })
    // }

    //get the new id
    // let id = USER_ID_COUNTER
    //     .with(|counter| {
    //         let current_value = *counter.borrow().get();
    //         counter.borrow_mut().set(current_value + 1)
    //     })
    //     .expect("cannot increment id counter");

    let new_user = User {
        user_id: data.user_principal_id,
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

// fn create_user_validation(data: &UserPayload) -> bool {
//     //email format validation using regex
//     let email_format = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();

//     //check if the email matches the regex
//     let email_format_valid = email_format.is_match(&data.user_email);

    
//     //check if email and username is unique
//     let email_unique = attribute_unique_validation(&data.user_email, UniqueAttribue::UserEmail); 
    

//     return email_format_valid && email_unique;
// }

fn do_insert_user(data: &User) -> bool {
    let p = Blob::from_bytes(std::borrow::Cow::Borrowed(&data.user_id));
    let a = USER_STORAGE.with(|service| service.borrow_mut().insert(p, data.clone()));
    match  a {
        Some(_user) => return false,
        None => return true,
    }
}

fn _get_user(id: &Vec<u8>) -> Option<User> {
    let p = Blob::from_bytes(std::borrow::Cow::Borrowed(id));
    USER_STORAGE.with(|service| service.borrow().get(&p))
}

// fn _get_user_by_principal_id(principal_id:Vec<u8>) -> Vec<User> {
//     USER_STORAGE.with(|us| {
//         us
//         .borrow()
//         .iter()
//         .filter_map(|(_,user)| {
//             if user.user_principal_id == *principal_id {
//                 Some(user.clone())
//             } else{
//                 None
//             }
//         }).collect()
//     })
// }

// #[ic_cdk::query]
// fn get_user_by_principal_id(principal_id:Vec<u8>) -> Result<User, Error> {
//     let a = _get_user_by_principal_id(principal_id);
//     if a.len() == 0{
//         return  Err(Error::NotFound {
//             msg: format!("not found"),
//         })
//     }
//     else {
//         return Ok(a.first().unwrap().clone())
//     }
// }


//Greet
#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::query]
fn get_user(id: Vec<u8>) -> Result<User, Error> {
    match _get_user(&id) {
        Some(user) => Ok(user),
        None => Err(Error::NotFound {
            msg: format!("a user with id={:?} not found", id),
        }),
    }
}

#[ic_cdk::update]
fn update_user(id: Vec<u8>, data: UserProfilePayload) -> Result<User, Error> {
    match USER_STORAGE.with(|service| service.borrow().get(&Blob::from_bytes(std::borrow::Cow::Borrowed(&id)))) {
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
                "couldn't update user with id={:?}. user not found",
                id
            ),
        }),
    }
}

#[ic_cdk::update]
fn get_feeds(id: Vec<u8>) -> Result<Option<Vec<Vec<u8>>>, Error> {
    //TODO: cek swipe pool klo gaada panggil generate_swipe function di generate_swipe/mod.rs

    //check if the feeds for the user for today's date already generated or not

    let curr_date = Utc::now().naive_utc().date();
    let mut already_generated = false;

    let p: Blob<29> = Blob::from_bytes(std::borrow::Cow::Borrowed(&id));

    let mut curr_swipe_pool: Option<SwipePool> = None;
    
    SWIPE_POOL_STORAGE.with(|service| {
        for (_, swipe_pool) in service.borrow().iter() {
            //belom di test -> masih nunggu ke generate dlu
            if swipe_pool.owner_id == id && swipe_pool.date == curr_date.to_string(){
                already_generated = true;
                curr_swipe_pool = Some(swipe_pool);
            }
        }    
    });

    if already_generated == true {
        return Result::Ok(Some(curr_swipe_pool.unwrap().user_ids))
    }

    //dummy
    return Result::Err(Error::NotFound { msg: "Invalid user ID".to_string() });
}


ic_cdk::export_candid!();
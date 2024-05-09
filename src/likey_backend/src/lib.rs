#[macro_use]
extern crate serde;
extern crate argon2;
use candid::{Decode, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::storable::Blob;
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable, StableVec};
use permission_helper::coin_sufficient;
use std::collections::HashMap;

// use std::time::{SystemTime, UNIX_EPOCH};
// use time::{PrimitiveDateTime, Duration};
// use serde::de::IntoDeserializer;
// use std::ptr::null;
use std::{borrow::Cow, cell::RefCell};
// use regex::Regex;

use std::{self};


//module generate swipe
pub mod generate_swipe;
pub mod date_helper;
mod permission_helper;

type Memory = VirtualMemory<DefaultMemoryImpl>;
// type IdCell = Cell<u64, Memory>;

static REVEAL_COST: i32 = 10; //per person revealed
static FILTER_ACCESS_COST: i32 = 100; //one time buy
static ADD_SWIPE_COST: i32 = 5; // per swipe
static ROLLBACK_COST: i32 = 10; //per person rollbacked

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
    swipe_filters: HashMap<String, FilterAttribute>,
    dob: String
    //TODO : tambahin attribute last time reset current swipe
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
struct SwipePool {
    owner_id: Vec<u8>,
    user_ids: Vec<Vec<u8>>,
    date: String
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
struct Hobby {
    user_id: Vec<u8>,
    name: String,
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
struct Interest {
    user_id_source: Vec<u8>,
    user_id_destination: Vec<u8>,
    is_interested: bool,
    is_revealed: bool
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

impl Storable for Interest {
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

impl BoundedStorable for Interest {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static USER_STORAGE: RefCell<StableBTreeMap<Blob<29>, User, Memory>> =
        RefCell::new(StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
    )); 

    // static SWIPE_POOL_STORAGE: RefCell<StableBTreeMap<Blob<29>, SwipePool, Memory>> =
    //     RefCell::new(StableBTreeMap::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
    // ));
    static SWIPE_POOL_STORAGE: RefCell<StableVec<SwipePool, Memory>> = 
        RefCell::new(StableVec::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
    ).unwrap_or_else(|_| panic!("Failed to initialize Swipe Pool Storage")));

    //pakai stableVec soalnya hobby storage gapakai key, tapi dia return nya result yg bisa jadi error, jadi perlu dipasangin unwrap
    static HOBBY_STORAGE: RefCell<StableVec<Hobby, Memory>> = 
        RefCell::new(StableVec::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3)))
    ).unwrap_or_else(|_| panic!("Failed to initialize Hobby Storage")));

    static INTEREST_STORAGE: RefCell<StableVec<Interest, Memory>> = 
        RefCell::new(StableVec::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4)))
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
    filter_access: bool,
    swipe_filters: HashMap<String, FilterAttribute>,
    dob: String
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

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct UpdateHobbyPayload {
    user_id: Vec<u8>,
    name: String
}

//update interest (swiping)
#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct AddInterestPayload {
    user_id_source: Vec<u8>,
    user_id_destination: Vec<u8>,
    is_interested: bool,
    is_revealed: bool
}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct UpdateIsInterestedPayload {
    user_id_source: Vec<u8>,
    user_id_destination: Vec<u8>,
    is_interested: bool,
}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct UpdateIsRevealedPayload {
    user_id_source: Vec<u8>,
    user_id_destination: Vec<u8>,
    is_revealed: bool,
}

#[derive(candid::CandidType, Deserialize, Serialize)]
enum Error {
    NotFound { msg: String },
    InvalidPayloadData {msg: String}
}
#[derive(candid::CandidType, Deserialize, Serialize, Clone)]
enum FilterAttribute {
    // Hobby {data: String},
    Gender {data: String}, 
    Education {data: i32},
    Religion {data: String},
    Height {data_start: i32, data_end: i32},
    Age {data_start: i32, data_end: i32}
}

//add interest -> swiping
#[ic_cdk::update]
fn add_interest(data: AddInterestPayload) -> Result<Option<Interest>, Error> {
    let user_source = _get_user(&data.user_id_source);
    let user_destination = _get_user(&data.user_id_destination);

    if user_source.is_none() || user_destination.is_none() {
        return Err(Error::InvalidPayloadData { msg: "invalid user id".to_string() });
    }

    let new_interest = Interest { user_id_source: data.user_id_source, user_id_destination: data.user_id_destination, is_interested: data.is_interested, is_revealed: false };

    match INTEREST_STORAGE.with(|service| service.borrow_mut().push(&new_interest)) {
        Ok(_) => Ok(Some(new_interest)),
        Err(_) => Err(Error::NotFound { msg: "Error adding new interest".to_string() })
    }
}

#[ic_cdk::update]
fn update_interest(data: UpdateIsInterestedPayload) -> Result<Option<Interest>, Error> {
    //cari dlu object interest nya, ambil positionnya (index nya), trus set value di idx tsb sama object user yg baru yg udah keupdate
    let interest = interest_exist(&data.user_id_source, &data.user_id_destination);

    match interest {
        //if it exists, get the index and set the new value of that index with new interest object
        Some(interest) => {
            let index = INTEREST_STORAGE.with(|s| {
                s.borrow().iter().position(|i| i == interest)
            });

            if let Some(index) = index {
                INTEREST_STORAGE.with(|s| {
                    let updated_interest = Interest{ user_id_source: data.user_id_source, user_id_destination: data.user_id_destination, is_interested: data.is_interested, is_revealed: interest.is_revealed};
                    s.borrow_mut().set(index.try_into().unwrap(), &updated_interest);
                });
            } else {
                return Err(Error::NotFound { msg: "index of interest not found".to_string() });
            }

            Ok(None)
        },
        //else, insert the new hobby to the hobby storage
        None => {
            Err(Error::NotFound { msg: "Interest not found".to_string()})
        },
    }
}

//difference with the update interest is only in updated_interest variable
#[ic_cdk::update]
fn update_reveal(data: UpdateIsRevealedPayload) -> Result<Option<Interest>, Error> {

    let coin_enough = permission_helper::coin_sufficient(&data.user_id_source, REVEAL_COST);

    if coin_enough == false {
        return Err(Error::InvalidPayloadData { msg: "User don't have enough coin".to_string() });
    }

    //cari dlu object interest nya, ambil positionnya (index nya), trus set value di idx tsb sama object user yg baru yg udah keupdate
    let interest = interest_exist(&data.user_id_source, &data.user_id_destination);

    match interest {
        //if it exists, get the index and set the new value of that index with new interest object
        Some(interest) => {
            let index = INTEREST_STORAGE.with(|s| {
                s.borrow().iter().position(|i| i == interest)
            });

            if let Some(index) = index {
                INTEREST_STORAGE.with(|s| {
                    let updated_interest = Interest{ user_id_source: data.user_id_source, user_id_destination: data.user_id_destination, is_interested: interest.is_interested, is_revealed: data.is_revealed};
                    s.borrow_mut().set(index.try_into().unwrap(), &updated_interest);
                });
            } else {
                return Err(Error::NotFound { msg: "index of interest not found".to_string() });
            }

            Ok(None)
        },
        //else, insert the new hobby to the hobby storage
        None => {
            Err(Error::NotFound { msg: "Interest not found".to_string()})
        },
    }
}

#[ic_cdk::update]
fn update_hobby(data: UpdateHobbyPayload) -> Result<Option<Hobby>, Error> {
    //check if the hobby of the user already exist or not
    let hobby = hobby_exist(&data);

    match hobby {
        //if it exists, delete the hobby and return none
        Some(hobby) => {
            let index = HOBBY_STORAGE.with(|s| {
                s.borrow().iter().position(|h| h == hobby)
            });

            if let Some(index) = index {
                HOBBY_STORAGE.with(|s| {
                    //ambil index terakhir
                    let last_index = s.borrow().len() - 1;
                    let last_index_hobby = s.borrow_mut().get(last_index);

                    match last_index_hobby {
                        //kalau index terakhir ada isinya
                        Some(last_index_hobby) => {
                            //set hobby di index yg match dengan hobby di idx terakhir
                            s.borrow_mut().set(index.try_into().unwrap(), &last_index_hobby);
                            //pop last index hobby
                            s.borrow_mut().pop()
                        },
                        None => None,
                    }
                });
            } else {
                return Err(Error::NotFound { msg: "index of hobby not found".to_string() });
            }

            Ok(None)
        },
        //else, insert the new hobby to the hobby storage
        None => {
            let new_hobby: Hobby = Hobby { user_id: data.user_id, name: data.name };
            match HOBBY_STORAGE.with(|service| service.borrow_mut().push(&new_hobby)) {
                Ok(_) => Ok(Some(new_hobby)),
                Err(_) => Err(Error::NotFound { msg: "error while inserting new hobby".to_string() })
            }
        },
    }
}

#[ic_cdk::update]
fn buy_filter_access(user_id: Vec<u8>) -> Result<Option<User>, Error> {
    //get user
    let user = _get_user(&user_id);

    match user {
        Some(mut user) => {
            //validate user's filter access still false
            if user.filter_access == true {
                return Err(Error::NotFound { msg: "User already bought filter access".to_string() })
            } else {
                //check user's balance
                let coin_enough = coin_sufficient(&user_id, FILTER_ACCESS_COST);

                if coin_enough == true {
                    //re insert user
                    user.filter_access = true;
                    do_insert_user(&user);
                    return Ok(Some(user))
                } else {
                    return Err(Error::NotFound { msg: "User's coin is not enough".to_string() })
                }
                
            }
        },
        None => Err(Error::NotFound { msg: "Invalid User id".to_string() }), 
    }
}

#[ic_cdk::query]
fn get_all_hobby_by_user_id(user_id: Vec<u8>) -> Vec<Hobby> {
    let mut output: Vec<Hobby> = Vec::new();

    HOBBY_STORAGE.with(|s| {
        for i in s.borrow().iter() {
            if i.user_id == user_id {
                output.push(i)
            }
        }
    });
    output
}

//get all interest by user (where the user is the user source)
#[ic_cdk::query]
fn get_all_interest_by_user_id(user_id: Vec<u8>) -> Vec<Interest> {
    let mut output: Vec<Interest> = Vec::new();
    INTEREST_STORAGE.with(|s| {
        for i in s.borrow().iter() {
            if i.user_id_source == user_id {
                output.push(i)
            }
        }
    });
    output
}

//history
#[ic_cdk::query]
fn get_not_interested_history(user_id: Vec<u8>) -> Vec<User> {
    let mut output: Vec<User> = Vec::new();
    INTEREST_STORAGE.with(|s| {
        for i in s.borrow().iter() {
            if (i.user_id_source == user_id ) && (i.is_interested == false){
                match _get_user(&i.user_id_destination){
                    Some(user) => output.push(user),
                    None => {},
                }  
            }
        }
    });
    output
}

fn hobby_exist(data: &UpdateHobbyPayload) -> Option<Hobby> {
    HOBBY_STORAGE.with(|s| {
        s.borrow().iter().find(|hobby| {
            hobby.user_id == data.user_id && hobby.name == data.name
        })
    })
}

fn interest_exist(user_id_source: &Vec<u8>, user_id_dest: &Vec<u8>) -> Option<Interest> {
    INTEREST_STORAGE.with(|s| {
        s.borrow().iter().find(|interest| {
            interest.user_id_source == *user_id_source && interest.user_id_destination == *user_id_dest
        })
    })
}


#[ic_cdk::update]
fn create_user(data: UserPayload) -> Result<Option<User>, Error> {

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
        swipe_filters: data.swipe_filters,
        dob: data.dob
    };

    //insert new User
    let insert_success = do_insert_user(&new_user);

    match insert_success {
        true => return Result::Ok(Some(new_user)),
        false => return Result::Err(Error::NotFound { msg: "error while inserting new user".to_string() })
    }

}

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

#[ic_cdk::query]
fn test_get_age(dob: String) -> i32 {
    date_helper::get_age(&dob)
}


#[ic_cdk::query]
fn generate_swipe_by_id(id: Vec<u8>) -> Result<Option<Vec<Vec<u8>>>, Error> {
    generate_swipe::generate_swipe(id)
}

//Greet
#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello : {}", name)
}

#[ic_cdk::query]
fn test_date() -> String {
    date_helper::get_current_date_time()
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

    //date format = yyyy-mm-dd
    let curr_date = date_helper::get_current_date();
    let mut already_generated = false;

    let mut curr_swipe_pool: Option<SwipePool> = None;
    
    SWIPE_POOL_STORAGE.with(|service| {
        for swipe_pool in service.borrow().iter() {
            //belom di test -> masih nunggu ke generate dlu
            if swipe_pool.owner_id == id && swipe_pool.date == curr_date.to_string(){
                already_generated = true;
                curr_swipe_pool = Some(swipe_pool);
            }
        }    
    });

    //if user's swipe pool already generated that day
    if already_generated == true {
        return Result::Ok(Some(curr_swipe_pool.unwrap().user_ids))
    }

    //else: generate user's swipe pool
    generate_swipe::generate_swipe(id)
}

#[ic_cdk::update]
fn update_swipe_filter(id: Vec<u8>, filter_attribute: HashMap<String, FilterAttribute>) -> Result<Option<HashMap<String, FilterAttribute>>, Error> {
    let user = _get_user(&id);

    match user {
        Some(mut user) => {

            if user.filter_access == false {
                return Err(Error::InvalidPayloadData { msg: "User need to buy filter access first".to_string() })
            }

            user.swipe_filters = filter_attribute;
            do_insert_user(&user);
            return Result::Ok(Some(user.swipe_filters))
        },
        None => return Result::Err(Error::InvalidPayloadData { msg: "Invalid user id".to_string() }),
    }
}



ic_cdk::export_candid!();
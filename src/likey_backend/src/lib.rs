#[macro_use]
extern crate serde;
extern crate argon2;
use candid::{Decode, Encode};
use ic_cdk::api::time;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::storable::Blob;
use ic_stable_structures::{vec, BoundedStorable, DefaultMemoryImpl, StableBTreeMap, StableVec, Storable};
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
pub mod random_helper;

type Memory = VirtualMemory<DefaultMemoryImpl>;
// type IdCell = Cell<u64, Memory>;

static REVEAL_COST: i32 = 10; //per person revealed
static FILTER_ACCESS_COST: i32 = 100; //one time buy
static ADD_SWIPE_COST: i32 = 5; // per swipe
static ROLLBACK_COST: i32 = 10; //per person rollbacked
static SWIPE_LIMIT_DEFAULT_PER_DAY: i32 = 30; //the swipe limit of each user per day by default

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
    dob: String,
    //supaya saat balik app, ga ulang swipe dari awal
    last_swipe_index: i32
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

// #[derive(candid::CandidType, Clone, Serialize, Deserialize, Default, PartialEq, Eq)]
// struct InterestByUserReturn {
//     user_destination: User,
//     is_interested: bool,
//     is_revealed: bool
// }

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
    dob: String,
}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct UpdateUserCoinPayload{
    likey_coin: i32
}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct UserProfilePayload {
    first_name: String,
    last_name: String,
    height: i32,
    education: i32,
    religion: String,
    description: String,
    profile_picture_link: String,
    photo_link: Vec<String>
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

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct SwipeMatchReturn {
    user_id_source: Vec<u8>,
    user_id_dest: Vec<u8>,
    is_matched: bool
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
fn add_interest(data: AddInterestPayload) -> Result<Option<SwipeMatchReturn>, Error> {
    let user_source = _get_user(&data.user_id_source);
    let user_destination = _get_user(&data.user_id_destination);

    if user_source.is_none() || user_destination.is_none() {
        return Err(Error::InvalidPayloadData { msg: "invalid user id".to_string() });
    }

    //check if the swipe balance is valid or not
    let swipe_balance_valid = current_swipe_valid(&user_source);

    if swipe_balance_valid == false {
        return Err(Error::InvalidPayloadData { msg: "User's swipe balance is not enough".to_string() })
    }

    let user_id_source_clone = data.user_id_source.clone();
    let user_id_dest_clone = data.user_id_destination.clone();


    let new_interest = Interest { user_id_source: data.user_id_source, user_id_destination: data.user_id_destination, is_interested: data.is_interested, is_revealed: false };

    //push the new interest
    match INTEREST_STORAGE.with(|service| service.borrow_mut().push(&new_interest)) {
        Ok(_) => {
            //update the current swipe balance of the user and the last index
            update_swipe_attribute_helper(&user_id_source_clone);

            let is_match = check_is_match(&user_id_source_clone, &data.is_interested, &user_id_dest_clone);
            let out = SwipeMatchReturn{ user_id_source: user_id_source_clone, user_id_dest: user_id_dest_clone, is_matched: is_match};
            Ok(Some(out))
        },
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
                    user.likey_coin = user.likey_coin - FILTER_ACCESS_COST;
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
// #[ic_cdk::query]
fn _get_all_interest_by_user_id(user_id: &Vec<u8>) -> Vec<Interest> {
    let mut output: Vec<Interest> = Vec::new();
    INTEREST_STORAGE.with(|s| {
        for i in s.borrow().iter() {
            if i.user_id_source == *user_id {
                output.push(i)
            }
        }
    });
    output
}

#[ic_cdk::query]
fn get_all_interest_and_users_by_user_id(user_id: Vec<u8>) -> (Vec<Interest>, Vec<User>) {
    let mut output_interest: Vec<Interest> = Vec::new();
    let mut output_user: Vec<User> = Vec::new();

    INTEREST_STORAGE.with(|s| {
        for i in s.borrow().iter() {
            //get all the user that interested with current user
            if (i.user_id_destination == user_id) && (i.is_interested == true) {
                match _get_user(&i.user_id_source){
                    Some(user) => {
                        output_user.push(user);
                        output_interest.push(i)
                    },
                    None => {},
                }  
                
            }
        }
    });
    (output_interest, output_user)
}


//get all user that the specifed user interested in
#[ic_cdk::query]
fn get_interested_history(user_id: Vec<u8>) -> Vec<User> {
    let mut output: Vec<User> = Vec::new();
    INTEREST_STORAGE.with(|s| {
        for i in s.borrow().iter() {
            if (i.user_id_source == user_id ) && (i.is_interested == true){
                match _get_user(&i.user_id_destination){
                    Some(user) => output.push(user),
                    None => {},
                }  
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
    //check if user with the same principal id already exist
    match _get_user(&data.user_principal_id) {
        Some(_) => {
            return Err(Error::InvalidPayloadData { msg: "User already exists".to_string() })
        },
        None => {
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
                filter_access: false,
                swipe_filters: data.swipe_filters,
                dob: data.dob,
                last_swipe_index: 0
            };
        
            //insert new User
            do_insert_user(&new_user);
            Ok(Some(new_user))
        },
    }
}


fn do_insert_user(data: &User) {
    let p = Blob::from_bytes(std::borrow::Cow::Borrowed(&data.user_id));
    USER_STORAGE.with(|service| service.borrow_mut().insert(p, data.clone()));
}

fn _get_user(id: &Vec<u8>) -> Option<User> {
    let p = Blob::from_bytes(std::borrow::Cow::Borrowed(id));
    USER_STORAGE.with(|service| service.borrow().get(&p))
}

#[ic_cdk::query]
fn test_get_age(dob: String) -> i32 {
    date_helper::get_age(&dob)
}


fn _generate_swipe_by_id(id: Vec<u8>) -> Option<Vec<Vec<u8>>> {
    generate_swipe::generate_swipe(&id)
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
            u.photo_link = data.photo_link;
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
fn update_coin(id: Vec<u8>, data: UpdateUserCoinPayload)->Result<User, Error>{
    // TODO: this function called if we want already success purchase a coin using ICP.

    // User likey_coin will be added with number of coins purchased.
    let user = _get_user(&id);
    match user{
        Some(mut u) => {
            u.likey_coin = u.likey_coin + data.likey_coin;
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
fn get_feeds(id: Vec<u8>) -> Result<Option<Vec<User>>, Error> {
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
        return Result::Ok(Some(_get_multiple_user_by_ids(curr_swipe_pool.unwrap().user_ids)))
    }

    //else: generate user's swipe pool

    //reset the swipe attribute
    reset_swipe_attribute_helper(&id);

    //generate the user
    match generate_swipe::generate_swipe(&id) {
        Some(ids) => {
            Ok(Some(_get_multiple_user_by_ids(ids)))
        },
        None => Err(Error::NotFound { msg: "Error while generating feeds".to_string() }),
    }
    
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

#[ic_cdk::update]
fn add_swipe(user_id: Vec<u8>, swipe_amount: i32, user_current_swipe:i32) -> Result<Option<User>, Error> {
    //check user's balance
    let coin_enough = permission_helper::coin_sufficient(&user_id, ADD_SWIPE_COST * swipe_amount);

    if coin_enough == false{
        return Err(Error::InvalidPayloadData { msg: "User's balance is not enough".to_string() })
    }

    let user = _get_user(&user_id);

    if user_current_swipe > 0 {
        return Err(Error::InvalidPayloadData { msg: "User's current swipe must be 0".to_string() })
    }
    match user {
        Some(mut user) => {
            user.current_swipe = user.current_swipe + swipe_amount;
            user.likey_coin = user.likey_coin - (ADD_SWIPE_COST * swipe_amount);
            do_insert_user(&user);
            generate_swipe::generate_swipe(&user_id);
            return Ok(Some(user));
        },
        None => return Err(Error::NotFound { msg: "User id not found".to_string() }),
    }
}

#[ic_cdk::update]
fn rollback_user(user_id_source: Vec<u8>, user_id_dest: Vec<u8>) -> Result<bool, Error> {
    //perlu cek di interest user id source apakah user id dest exist dan isInterested false
    //cek balance user
    //update is_interested menjadi true (trus lanjutin logic match)
    
    let interest = interest_exist(&user_id_source, &user_id_dest);

    match interest {
        Some(interest) => {
            if interest.is_interested == false {
                let coin_enough = permission_helper::coin_sufficient(&user_id_source, ROLLBACK_COST);

                if coin_enough == true {
                    match _get_user(&user_id_source) {
                        Some(mut user) => {
                            //update user's coin
                            user.likey_coin = user.likey_coin - ROLLBACK_COST;
                            do_insert_user(&user);

                            let mut new_interest = interest.clone();
                            new_interest.is_interested = true;

                            //update interest
                            match _update_interest_helper(interest, new_interest) {
                                Some(_) => return Ok(true),
                                None => return Err(Error::NotFound { msg: "Error when updating interest".to_string() })
                            }
                        },
                        None => return Err(Error::NotFound { msg: "User not found".to_string() }),
                    }
                }

                return Err(Error::NotFound { msg: "User's coin is not enough".to_string() });
            }

            return Err(Error::InvalidPayloadData { msg: "User's already interested with the specified user".to_string() })
        },
        None => return Err(Error::NotFound { msg: "Interest not found".to_string() }),
    }
}

#[ic_cdk::query]
fn get_last_swipe_index_by_user_id(user_id: Vec<u8>) -> Result<i32, Error> {
    let user = _get_user(&user_id);

    match user {
        Some(user) => Ok(user.last_swipe_index),
        None =>  Err(Error::InvalidPayloadData { msg: "Invalid user id".to_string() })
    }
}

#[ic_cdk::query]
fn test_rand(mut vec: Vec<u8>) -> Vec<u8> {
    random_helper::shuffle(&mut vec, time());
    vec
}

fn _update_interest_helper(data_before: Interest, data_after: Interest) -> Option<Interest> {
    let index = INTEREST_STORAGE.with(|s| {
        s.borrow().iter().position(|i| i == data_before)
    });

    if let Some(index) = index {
        INTEREST_STORAGE.with(|s| {
            s.borrow_mut().set(index.try_into().unwrap(), &data_after);
        });

        Some(data_after)
    } else {
        None
    }
}

// #[ic_cdk::query]
fn _get_multiple_user_by_ids(user_ids: Vec<Vec<u8>>) -> Vec<User> {
    
    USER_STORAGE.with(|user_storage| {
        let s = user_storage.borrow();

        user_ids
        .into_iter()
        .filter_map(|id| {
            let p = Blob::from_bytes(std::borrow::Cow::Borrowed(&id));

            match s.get(&p) {
                Some(user) => Some(user.clone()),
                None => None,
            }
            
        })
        .collect()
    })    
}

fn current_swipe_valid(user: &Option<User>) -> bool {
    match user {
        Some(user) => {
            if user.current_swipe > 0 {
                return true
            }
        },
        None => return false,
    }

    return false
}

fn update_swipe_attribute_helper(user_id: &Vec<u8>) {
    let user = _get_user(&user_id);

    match user {
        Some(mut user) => {
            user.current_swipe = user.current_swipe - 1;
            user.last_swipe_index = user.last_swipe_index + 1;
            do_insert_user(&user);
        },
        None => {},
    }
}

fn reset_swipe_attribute_helper(user_id: &Vec<u8>) {
    let user = _get_user(&user_id);

    match user {
        Some(mut user) => {
            user.current_swipe = SWIPE_LIMIT_DEFAULT_PER_DAY;
            user.last_swipe_index = 0;
            do_insert_user(&user);
        },
        None => {},
    }
}

fn check_is_match(user_id_source: &Vec<u8>, user_id_source_interest: &bool, user_id_dest: &Vec<u8>) -> bool {

    //if the user source is not interested, return false
    if *user_id_source_interest == false {
        return false
    }
    //check if the user dest like the user source
    INTEREST_STORAGE.with(|s| {
        for i in s.borrow().iter() {
            if (i.user_id_source == *user_id_dest) && (i.user_id_destination == *user_id_source) && (i.is_interested == true){
                return true
            }
        }
        return false
    })
}


// fn create_user_dummy_helper(data: UserPayload) -> Result<Option<User>, Error> {
//     //check if user with the same principal id already exist
//     match _get_user(&data.user_principal_id) {
//         Some(_) => {
//             return Err(Error::InvalidPayloadData { msg: "User already exists".to_string() })
//         },
//         None => {
//             let new_user = User {
//                 user_id: data.user_principal_id,
//                 first_name: data.first_name,
//                 last_name: data.last_name,
//                 height: data.height,
//                 gender: data.gender,
//                 education: data.education,
//                 religion: data.religion,
//                 description: data.description,
//                 profile_picture_link: data.profile_picture_link,
//                 photo_link: data.photo_link,
//                 likey_coin: 0,
//                 current_swipe: data.current_swipe,
//                 filter_access: data.filter_access,
//                 swipe_filters: data.swipe_filters,
//                 dob: data.dob,
//                 last_swipe_index: 0
//             };
        
//             //insert new User
//             do_insert_user(&new_user);
//             Ok(Some(new_user))
//         },
//     }
// }

#[ic_cdk::update]
fn create_user_dummy(data: UserPayload) -> Result<Option<User>, Error> {
    //check if user with the same principal id already exist
    match _get_user(&data.user_principal_id) {
        Some(_) => {
            return Err(Error::InvalidPayloadData { msg: "User already exists".to_string() })
        },
        None => {

            let mut filter_map: HashMap<String, FilterAttribute> = HashMap::new();

            // Inserting values into the HashMap
            filter_map.insert("Gender".to_string(), FilterAttribute::Gender { data: "".to_string() });
            filter_map.insert("Education".to_string(), FilterAttribute::Education { data: 0 });
            filter_map.insert("Religion".to_string(), FilterAttribute::Religion { data: "".to_string() });
            filter_map.insert("Height".to_string(), FilterAttribute::Height { data_start: 0, data_end: 0 });
            filter_map.insert("Age".to_string(), FilterAttribute::Age { data_start: 0, data_end: 0 });

            let mut filter_map1: HashMap<String, FilterAttribute> = HashMap::new();

            filter_map1.insert("Gender".to_string(), FilterAttribute::Gender { data: "Female".to_string() });
            filter_map1.insert("Education".to_string(), FilterAttribute::Education { data: 0 });
            filter_map1.insert("Religion".to_string(), FilterAttribute::Religion { data: "".to_string() });
            filter_map1.insert("Height".to_string(), FilterAttribute::Height { data_start: 0, data_end: 0 });
            filter_map1.insert("Age".to_string(), FilterAttribute::Age { data_start: 20, data_end: 24 });
            
            let new_user = User {
                user_id: vec![1],
                first_name: "Josua".to_string(),
                last_name: data.last_name.clone(),
                height: data.height.clone(),
                gender: data.gender.clone(),
                education: data.education.clone(),
                religion: data.religion.clone(),
                description: data.description.clone(),
                profile_picture_link: data.profile_picture_link.clone(),
                photo_link: data.photo_link.clone(),
                likey_coin: 0,
                current_swipe: data.current_swipe.clone(),
                filter_access: data.filter_access.clone(),
                swipe_filters: filter_map1.clone(),
                dob: data.dob.clone(),
                last_swipe_index: 0
            };

            let new_user2 = User {
                user_id: vec![2],
                first_name: "Josua2".to_string(),
                last_name: data.last_name.clone(),
                height: data.height.clone(),
                gender: data.gender.clone(),
                education: data.education.clone(),
                religion: data.religion.clone(),
                description: data.description.clone(),
                profile_picture_link: data.profile_picture_link.clone(),
                photo_link: data.photo_link.clone(),
                likey_coin: 0,
                current_swipe: data.current_swipe.clone(),
                filter_access: data.filter_access.clone(),
                swipe_filters: filter_map.clone(),
                dob: data.dob.clone(),
                last_swipe_index: 0
            };

            let new_user3 = User {
                user_id: vec![3],
                first_name: "Josua3Female".to_string(),
                last_name: data.last_name.clone(),
                height: data.height.clone(),
                gender: "Female".to_string(),
                education: data.education.clone(),
                religion: data.religion.clone(),
                description: data.description.clone(),
                profile_picture_link: data.profile_picture_link.clone(),
                photo_link: data.photo_link.clone(),
                likey_coin: 0,
                current_swipe: data.current_swipe.clone(),
                filter_access: data.filter_access.clone(),
                swipe_filters: filter_map1,
                dob: data.dob.clone(),
                last_swipe_index: 0
            };

            let new_user4 = User {
                user_id: vec![4],
                first_name: "Josua4Femle".to_string(),
                last_name: data.last_name.clone(),
                height: data.height.clone(),
                gender: "Female".to_string(),
                education: data.education.clone(),
                religion: data.religion.clone(),
                description: data.description.clone(),
                profile_picture_link: data.profile_picture_link.clone(),
                photo_link: data.photo_link.clone(),
                likey_coin: 0,
                current_swipe: data.current_swipe.clone(),
                filter_access: data.filter_access.clone(),
                swipe_filters: filter_map,
                dob: data.dob.clone(),
                last_swipe_index: 0
            };
        
            //insert new User
            do_insert_user(&new_user);
            do_insert_user(&new_user2);
            do_insert_user(&new_user3);
            do_insert_user(&new_user4);

            Ok(Some(new_user))
        },
    }
}

// #[ic_cdk::query]
// fn generate_dummy() -> Result<Option<User>, Error> {

//     let mut filter_map: HashMap<String, FilterAttribute> = HashMap::new();

//     // Inserting values into the HashMap
//     filter_map.insert("Gender".to_string(), FilterAttribute::Gender { data: "".to_string() });
//     filter_map.insert("Education".to_string(), FilterAttribute::Education { data: 0 });
//     filter_map.insert("Religion".to_string(), FilterAttribute::Religion { data: "".to_string() });
//     filter_map.insert("Height".to_string(), FilterAttribute::Height { data_start: 0, data_end: 0 });
//     filter_map.insert("Age".to_string(), FilterAttribute::Age { data_start: 0, data_end: 0 });

//     let user_principal_id1: Vec<u8> = vec![71];

//     // let mut filter_map1: HashMap<String, FilterAttribute> = HashMap::new();

//     // filter_map1.insert("Gender".to_string(), FilterAttribute::Gender { data: "Female".to_string() });
//     // filter_map1.insert("Education".to_string(), FilterAttribute::Education { data: 0 });
//     // filter_map1.insert("Religion".to_string(), FilterAttribute::Religion { data: "".to_string() });
//     // filter_map1.insert("Height".to_string(), FilterAttribute::Height { data_start: 0, data_end: 0 });
//     // filter_map1.insert("Age".to_string(), FilterAttribute::Age { data_start: 20, data_end: 24 });

//     // let new_user1 = User { user_id: vec![1u8], first_name: "First".to_string(), last_name: "User".to_string(), height: 170, gender: "Male".to_string(), education: 2, religion: "Christian".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map.clone(), dob: "1995-09-14".to_string(), last_swipe_index: 0};
//     // let new_user2 = User { user_id: vec![2u8], first_name: "Second".to_string(), last_name: "User".to_string(), height: 170, gender: "Male".to_string(), education: 2, religion: "Muslim".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map.clone(), dob: "1996-09-14".to_string(), last_swipe_index: 0};
//     // let new_user3 = User { user_id: vec![3u8], first_name: "Third".to_string(), last_name: "User".to_string(), height: 170, gender: "Male".to_string(), education: 2, religion: "Christian".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map1.clone(), dob: "1997-09-14".to_string(), last_swipe_index: 0};
//     // let new_user4 = User { user_id: vec![4u8], first_name: "Fourth".to_string(), last_name: "User".to_string(), height: 170, gender: "Male".to_string(), education: 2, religion: "Muslim".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map.clone(), dob: "1998-09-14".to_string(), last_swipe_index: 0};
//     // let new_user5 = User { user_id: vec![5u8], first_name: "Fifth".to_string(), last_name: "User".to_string(), height: 170, gender: "Male".to_string(), education: 2, religion: "Christian".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map.clone(), dob: "1999-09-14".to_string(), last_swipe_index: 0};
//     // let new_user6 = User { user_id: vec![6u8], first_name: "Sixth".to_string(), last_name: "User".to_string(), height: 170, gender: "Female".to_string(), education: 2, religion: "Muslim".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map1.clone(), dob: "2000-09-14".to_string(), last_swipe_index: 0};
//     // let new_user7 = User { user_id: vec![7u8], first_name: "Seventh".to_string(), last_name: "User".to_string(), height: 170, gender: "Female".to_string(), education: 2, religion: "Christian".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map.clone(), dob: "2001-09-14".to_string(), last_swipe_index: 0};
//     // let new_user8 = User { user_id: vec![8u8], first_name: "Eighth".to_string(), last_name: "User".to_string(), height: 170, gender: "Female".to_string(), education: 2, religion: "Muslim".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map.clone(), dob: "2002-09-14".to_string(), last_swipe_index: 0};
//     // let new_user9 = User { user_id: vec![9u8], first_name: "Nineth".to_string(), last_name: "User".to_string(), height: 170, gender: "Female".to_string(), education: 2, religion: "Christian".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map1.clone(), dob: "2003-09-14".to_string(), last_swipe_index: 0};
//     // let new_user10 = User { user_id: vec![10u8], first_name: "Tenth".to_string(), last_name: "User".to_string(), height: 170, gender: "Female".to_string(), education: 2, religion: "Muslim".to_string(), description: "this is description".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec!["https://picsum.photos/200/200".to_string()], likey_coin: 50, current_swipe: 30, filter_access: true, swipe_filters: filter_map.clone(), dob: "2004-09-14".to_string(), last_swipe_index: 0};

//     let data: UserPayload = UserPayload {user_principal_id: user_principal_id1, first_name: "First".to_string(), last_name: "User".to_string(), height: 170, gender: "Male".to_string(), education: 2, religion: "Christian".to_string(), description: "asdasd".to_string(), profile_picture_link: "https://picsum.photos/200/200".to_string(), photo_link: vec![], likey_coin: 0 as i32, current_swipe: 0 as i32, filter_access: false, swipe_filters: filter_map, dob: "1995-09-14".to_string()};

//     // create_user_dummy_helper(data)
//     let new_user = User {
//         user_id: data.user_principal_id,
//         first_name: data.first_name,
//         last_name: data.last_name,
//         height: data.height,
//         gender: data.gender,
//         education: data.education,
//         religion: data.religion,
//         description: data.description,
//         profile_picture_link: data.profile_picture_link,
//         photo_link: data.photo_link,
//         likey_coin: 0,
//         current_swipe: data.current_swipe,
//         filter_access: data.filter_access,
//         swipe_filters: data.swipe_filters,
//         dob: data.dob,
//         last_swipe_index: 0
//     };

//     //insert new User
//     do_insert_user(&new_user);
//     Ok(Some(new_user))

//     // do_insert_user(&new_user1);
//     // Ok(new_user1)
//     // let p = Blob::from_bytes(std::borrow::Cow::Borrowed(&new_user1.user_id));
//     // match USER_STORAGE.with(|service| service.borrow_mut().insert(p, new_user1.clone())) {
//     //     Some(user) => return Ok(user),
//     //     None => return Err(Error::NotFound { msg: "error".to_string() }),
//     // }
    
//     // do_insert_user(&new_user2);
//     // do_insert_user(&new_user3);
//     // do_insert_user(&new_user4);
//     // do_insert_user(&new_user5);
//     // do_insert_user(&new_user6);
//     // do_insert_user(&new_user7);
//     // do_insert_user(&new_user8);
//     // do_insert_user(&new_user9);
//     // do_insert_user(&new_user10);
// }

ic_cdk::export_candid!();

use std::time::Duration;

use ic_cdk::api::time;


pub(crate) fn get_current_date_time() -> String {
    let nanoseconds_since_epoch = time();

    // Convert nanoseconds to seconds
    let seconds_since_epoch = nanoseconds_since_epoch / 1_000_000_000;

    // Create a Duration representing the time since the UNIX epoch
    let duration = Duration::new(seconds_since_epoch as u64, 0);

    // Calculate the current date and time
    let (year, month, day, hour, minute, second) = calculate_date_time(duration);

    // Format the date and time components into a string
    let formatted_time = format!("{}-{:02}-{:02} {:02}:{:02}:{:02}", year, month, day, hour, minute, second);

    formatted_time
}

pub(crate) fn get_current_date() -> String {
    let nanoseconds_since_epoch = time();

    let seconds_since_epoch = nanoseconds_since_epoch / 1_000_000_000;
    let duration = Duration::new(seconds_since_epoch as u64, 0);
    let (year, month, day, hour, minute, second) = calculate_date_time(duration);
    let formatted_time = format!("{}-{:02}-{:02}", year, month, day);

    formatted_time
}

pub(crate) fn get_age(dob: &String) -> i32 {
    let curr_date = get_current_date();

    // Parse the start and end dates
    let dob_parts: Vec<&str> = dob.split('-').collect();
    let curr_date_parts: Vec<&str> = curr_date.split('-').collect();
    
    let dob_year = dob_parts[0].parse::<i32>().unwrap();
    let dob_month = dob_parts[1].parse::<i32>().unwrap();
    let dob_day = dob_parts[2].parse::<i32>().unwrap();

    let curr_date_year = curr_date_parts[0].parse::<i32>().unwrap();
    let curr_date_month = curr_date_parts[1].parse::<i32>().unwrap();
    let curr_date_day = curr_date_parts[2].parse::<i32>().unwrap();

    //calculate the difference in years
    let mut year_diff = curr_date_year - dob_year;

    //adjust the difference if necessary based on month and day
    if curr_date_month < dob_month || (curr_date_month == dob_month && curr_date_day < dob_day) {
        year_diff -= 1;
    }

    year_diff
}

fn calculate_date_time(duration: Duration) -> (i64, u32, u32, u32, u32, u32) {
    // Calculate the number of seconds since the UNIX epoch
    let seconds = duration.as_secs();

    // Calculate the number of days
    let days = seconds / (24 * 3600);

    // Calculate the number of remaining seconds after removing the days
    let remaining_seconds = seconds % (24 * 3600);

    // Calculate the number of hours
    let hours = remaining_seconds / 3600;

    // Calculate the number of remaining seconds after removing the hours
    let remaining_seconds = remaining_seconds % 3600;

    // Calculate the number of minutes
    let minutes = remaining_seconds / 60;

    // Calculate the number of remaining seconds after removing the minutes
    let seconds = remaining_seconds % 60;

    // Calculate the year, month, and day based on the number of days
    let mut year = 1970;
    let mut days_left = days;
    let mut month = 1;
    let mut day = 1;

    while days_left >= 365 {
        let is_leap_year = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
        let days_in_year = if is_leap_year { 366 } else { 365 };

        if days_left >= days_in_year {
            year += 1;
            days_left -= days_in_year;
        } else {
            break;
        }
    }
    let days_in_month = [31, if year % 4 == 0 { 29 } else { 28 }, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for (i, days_in_current_month) in days_in_month.iter().enumerate() {
        if days_left >= *days_in_current_month as u64 {
            month += 1;
            days_left -= *days_in_current_month as u64;
        } else {
            day += days_left as u32;
            break;
        }
    }

    (year, month, day, hours as u32, minutes as u32, seconds as u32)
}


const DayData: {[key : number] : string} = {
    0: "Sunday",
    1 : "Monday",
    2 : "Tuesday",
    3 : "Wednesday",
    4 : "Thursday",
    5 : "Friday",
    6 : "Saturday",
}

const MonthData: {[key : number] : string} = {
    1 : "Jan",
    2 : "Feb",
    3 : "Mar",
    4 : "Apr",
    5 : "May",
    6 : "Jun",
    7 : "Jul",
    8 : "Aug",
    9 : "Sep",
    10 : "Oct",
    11 : "Nov",
    12 : "Dec",
}

export const DateConverter = (timestamp : number) => {
    
    const date = new Date(timestamp * 1000); 
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth =currentDate.getMonth() + 1
    const currentDay = currentDate.getDate()

    const week = new Date(currentDate)
    week.setDate(week.getDate() - week.getDay())

    if((currentYear == year) && (currentMonth == month) && (currentDay == day)){
        return `${hours}:${minutes}`
    }
    else if((currentYear == year) && (currentMonth == month) && (currentDay == day+1)){
        return 'Yesterday'
    }
    else if((date >= week) && (date <= currentDate)){
        return DayData[date.getDay()]
    }
    else if((currentYear == year)){
        return `${MonthData[month]} , ${day}`
    }

    return `${MonthData[month]} ${day}, ${year}`;
}

export const ChatDateConverter = (timestamp : number) => {
    
    const date = new Date(timestamp * 1000); 

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes}`;
}
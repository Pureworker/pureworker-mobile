import Toast from 'react-native-simple-toast';
import {DateTime} from 'luxon';

export const ToastShort = (msg: string) => {
  Toast.show(msg, Toast.SHORT);
};

export const ToastLong = (msg: string) => {
  Toast.show(msg, Toast.LONG);
};

export const isValidPhoneNumber = (phoneNumber: any) => {
  // Replace this regex with the appropriate regex for your phone number validation
  // const phoneRegex = /^\d{10}$/; // Example: 10-digit phone number
  const phoneRegex =
    /^(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}$/;
  const regex =
    /((^\+234)[0-9]{10})|((^234)[0-9]{10})|((^0)(7|8|9)(0|1)[0-9]{8})/;

  return regex.test(phoneNumber);
};

function validateNigerianPhoneNumber(phoneNumber) {
  const regex =
    /((^\+234)[0-9]{10})|((^234)[0-9]{10})|((^0)(7|8|9)(0|1)[0-9]{8})/;
  return regex.test(phoneNumber);
}

export function roundToSingleDigit(number: number) {
  return Math.round(number);
}

export function formatDateToCustomFormat(dateString: any) {
  const options = {year: 'numeric', month: 'short', day: 'numeric'};
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options,
  );
  return formattedDate;
}

export function removeUnnecessaryNewLines(text) {
  // Define the regular expression pattern to match unnecessary new lines
  const pattern = /(\r?\n){2,}/g; // Matches two or more consecutive new lines

  // Replace unnecessary new lines with a single new line
  const cleanText = text?.replace(pattern, '\n');

  return cleanText;
}
// export function formatDateHistory(inputDateStr) {
//   const inputDate = new Date(inputDateStr);

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const dayOfWeek = daysOfWeek[inputDate.getUTCDay()];

//   const dayOfMonth = inputDate.getUTCDate();

//   // Adjust the hours and minutes to your desired format
//   const hours = inputDate.getUTCHours();
//   const minutes = inputDate.getUTCMinutes();

//   // Format the output string
//   const formattedDate = `${dayOfWeek} ${dayOfMonth}, ${hours}:${minutes}`;

//   return formattedDate;
// }
export function formatDateHistory(inputDateStr: any) {
  const inputDate = DateTime.fromISO(inputDateStr, {zone: 'Africa/Lagos'});

  const dayOfWeek = inputDate.toFormat('ccc');
  const dayOfMonth = inputDate.toFormat('d');
  const hours = inputDate.toFormat('H');
  const minutes = inputDate.toFormat('mm');

  const formattedDate = `${dayOfWeek} ${dayOfMonth}, ${hours}:${minutes}`;

  return formattedDate;
}
export function formatDateHistory2(inputDateStr: any) {
  const inputDate = DateTime.fromISO(inputDateStr, {zone: 'Africa/Lagos'});

  const dayOfWeek = inputDate.toFormat('ccc');
  const dayOfMonth = inputDate.toFormat('d');
  const month = inputDate.toFormat('LLL'); // Month abbreviation
  const year = inputDate.toFormat('yyyy');
  let hours = inputDate.toFormat('h');
  const minutes = inputDate.toFormat('mm');
  const period = inputDate.toFormat('a'); // AM/PM

  // Ensure single digit hours have leading zero for consistency
  hours = hours.padStart(2, '0');

  const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month}, ${year}, ${hours}:${minutes} ${period.toLowerCase()}`;

  return formattedDate;
}
export function formatDateHistory3(inputDateStr: any) {
  const inputDate = DateTime.fromISO(inputDateStr, {zone: 'Africa/Lagos'});

  const dayOfWeek = inputDate.toFormat('ccc');
  const dayOfMonth = inputDate.toFormat('d');
  const month = inputDate.toFormat('LLL'); // Month abbreviation
  const year = inputDate.toFormat('yyyy');
  const hours = inputDate.toFormat('H');
  const minutes = inputDate.toFormat('mm');

  const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month}, ${year}`;

  return formattedDate;
}

export function metersToKilometers(meters) {
  const kilometers = meters / 1000; // Convert meters to kilometers
  const roundedKilometers = Math.round(kilometers); // Round to the nearest whole number
  return `${roundedKilometers} km`;
}

export function timeAgo(lastOnline) {
  const currentTime = new Date();
  const lastOnlineTime = new Date(lastOnline);
  const timeDifference = (currentTime - lastOnlineTime) / 1000; // Convert milliseconds to seconds

  // Convert the time difference to minutes
  const minutes = Math.floor(timeDifference / 60);

  if (minutes < 1) {
    // If difference is less than a minute, show seconds
    const seconds = Math.floor(timeDifference);
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (minutes < 60) {
    // If difference is less than an hour, show minutes
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else {
    // Convert the time difference to hours
    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      // If difference is less than a day, show hours
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      // Convert the time difference to days
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  }
}

// export function timeAgo(lastOnline) {
//   const currentTime = new Date();
//   const lastOnlineTime = new Date(lastOnline);
//   const timeDifference = currentTime - lastOnlineTime;

//   // Convert the time difference to minutes
//   const minutes = Math.floor(timeDifference / (1000 * 60));

//   if (minutes < 60) {
//     return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
//   } else {
//     // Convert the time difference to hours
//     const hours = Math.floor(minutes / 60);

//     if (hours < 24) {
//       return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
//     } else {
//       // Convert the time difference to days
//       const days = Math.floor(hours / 24);
//       return `${days} day${days !== 1 ? 's' : ''} ago`;
//     }
//   }
// }

// export function messageTimeStamp(timestamp: string | number | Date) {
//   const date = new Date(timestamp);
//   const hours = String(date.getUTCHours()).padStart(2, '0');
//   const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//   return `${hours}:${minutes}`;
// }
export function messageTimeStamp(timestamp: string | number | Date) {
  const date = new Date(timestamp);

  // Adjusting for UTC+1
  date.setUTCHours(date.getUTCHours() + 1);

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDate3(dateString) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC', // Assuming the input date string is in UTC timezone
  };
  const date = new Date(dateString);
  date.setUTCHours(date.getUTCHours() + 1);
  const formattedDate = date.toLocaleDateString('en-GB', options);
  const formattedTime = date.toLocaleTimeString('en-GB', options);
  return formattedDate;
}

// Example usage:
const lastOnlineTimestamp = '2024-02-03T01:31:07.957Z';
const result = timeAgo(lastOnlineTimestamp);
console.log(result);

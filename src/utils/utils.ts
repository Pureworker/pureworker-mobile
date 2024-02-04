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

  return phoneRegex.test(phoneNumber);
};

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
export function metersToKilometers(meters) {
  const kilometers = meters / 1000; // Convert meters to kilometers
  const roundedKilometers = Math.round(kilometers); // Round to the nearest whole number
  return `${roundedKilometers} km`;
}

export function timeAgo(lastOnline) {
  const currentTime = new Date();
  const lastOnlineTime = new Date(lastOnline);
  const timeDifference = currentTime - lastOnlineTime;

  // Convert the time difference to minutes
  const minutes = Math.floor(timeDifference / (1000 * 60));

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else {
    // Convert the time difference to hours
    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      // Convert the time difference to days
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  }
}

// Example usage:
const lastOnlineTimestamp = '2024-02-03T01:31:07.957Z';
const result = timeAgo(lastOnlineTimestamp);
console.log(result);

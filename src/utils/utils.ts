import Toast from 'react-native-simple-toast';

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

export function formatDateHistory(inputDateStr) {
  const inputDate = new Date(inputDateStr);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = daysOfWeek[inputDate.getUTCDay()];

  const dayOfMonth = inputDate.getUTCDate();

  // Adjust the hours and minutes to your desired format
  const hours = inputDate.getUTCHours();
  const minutes = inputDate.getUTCMinutes();

  // Format the output string
  const formattedDate = `${dayOfWeek} ${dayOfMonth}, ${hours}:${minutes}`;

  return formattedDate;
}
export function metersToKilometers(meters) {
  const kilometers = meters / 1000; // Convert meters to kilometers
  const roundedKilometers = Math.round(kilometers); // Round to the nearest whole number
  return `${roundedKilometers} km`;
}

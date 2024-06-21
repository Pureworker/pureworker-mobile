import {number} from 'yup';

// inspired by ChatGPT
export const isLeapYear = (year: any ) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const validateDate = (
  key: string,
  value: number | undefined,
  dateObj: any,
) => {
  const newDate = new Date();
  console.log(typeof value, key);
  if (typeof value !== 'number' || (!(value === 0) && !(value > 0))) {
    return {
      isSuccess: false,
      message:
        'Invalid value, kindly input a valid number for day, month and year',
    };
  }

  //   console.log(key, value, dateObj);

  if (key === 'day') {
    if (
      value > 31 ||
      (dateObj.month === 1 && value > 29 && !isLeapYear(dateObj.year)) ||
      ((dateObj.month === 3 ||
        dateObj.month === 5 ||
        dateObj.month === 8 ||
        dateObj.month === 10) &&
        value > 30)
    ) {
      return {
        isSuccess: false,
        message: 'Invalid day given',
      };
    }
  }

  if (key === 'month') {
    if (value > 12 || value === 0) {
      return {
        isSuccess: false,
        message: 'Invalid month given',
      };
    }
  }

  if (key === 'year') {
    if (value > newDate.getFullYear() || value < 1600) {
      return {
        isSuccess: false,
        message: 'Invalid year given',
      };
    }
  }

  return {isSuccess: true};
};

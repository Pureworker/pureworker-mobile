// errorHandler.js

class APIError extends Error {
  constructor(message: string | undefined, statusCode: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

const handleAPIError = res => {
  if (res?.error?.message === 'Validation error') {
    return res?.error?.error?.data?.[0];
  } else if (res?.error?.message) {
    return res?.error?.message;
  } else if (res?.error?.data?.message) {
    return res?.error?.data?.message;
  } else {
    return 'Oops!, an error occurred';
  }
};

module.exports = {
  APIError,
  handleAPIError,
};

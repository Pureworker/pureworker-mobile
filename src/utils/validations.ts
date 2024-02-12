export function formatAmount(amount: string | number) {
  // Check if the input is a number
  if (typeof amount !== 'number') {
    // If it's not a number, attempt to convert it
    amount = parseFloat(amount);
    if (isNaN(amount)) {
      // If it's not a valid number, return an error message
      return 'Invalid amount';
    }
  }
  // Use toLocaleString to format the number with commas as thousands separators
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatAmount2(amount: string | number) {
  // Check if the input is a number
  if (typeof amount !== 'number') {
    // If it's not a number, attempt to convert it
    amount = parseFloat(amount);
    if (isNaN(amount)) {
      // If it's not a valid number, return an error message
      return 'Invalid amount';
    }
  }
  // Use toLocaleString to format the number with commas as thousands separators
  // Set maximumFractionDigits to 2 for a maximum of 2 decimal places
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

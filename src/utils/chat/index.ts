export const urlValidator = (text: string) => {
  const regex = /^(https?:\/\/).+\.(jpg|png)$/i;

  return regex.test(text);
};

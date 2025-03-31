export const validatePhoneNumber = (value) => {
  const cleanedValue = value.replace(/\s/g, '').replace(/[^\d+]/g, '');

  if (cleanedValue.startsWith('+380') && cleanedValue.length === 13) {
    return true;
  } else if (cleanedValue.startsWith('380') && cleanedValue.length === 12) {
    return true;
  } else if (cleanedValue.startsWith('8') && cleanedValue.length === 11) {
    return true;
  } else if (cleanedValue.startsWith('0') && cleanedValue.length === 10) {
    return true;
  } else {
    return ' Ввведіть номер у форматі: +380XXXXXXXXX';
  }
};

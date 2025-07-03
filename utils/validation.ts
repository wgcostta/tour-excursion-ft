export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  return cleanCNPJ.length === 14;
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  return cleanNumber.length >= 13 && cleanNumber.length <= 19;
};

export const validateCVV = (cvv: string): boolean => {
  const cleanCVV = cvv.replace(/\D/g, '');
  return cleanCVV.length >= 3 && cleanCVV.length <= 4;
};


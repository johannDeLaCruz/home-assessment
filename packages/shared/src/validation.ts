export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password: string): boolean =>
  password.length >= 8;

export const sanitize = (str: string): string =>
  str.trim().slice(0, 1000);

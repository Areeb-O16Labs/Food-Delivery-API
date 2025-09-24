import { UnprocessableEntityException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

export const customResponseHandler = async (data: any, message: string) => {
  return { data: data, message: message };
};

export const tokenResponseHandler = async (
  data: any,
  token: any,
  message: string,
) => {
  return { data: data, tokenDetails: token, message: message };
};

export const hashPassword = async (attemptPass: string) => {
  const salt = await genSalt(10);
  const password = await hash(attemptPass, salt);
  return password;
};

export const hasOldPassword = async (attemptPass: string, password: string) => {
  const match = await compare(attemptPass, password);
  if (match)
    throw new UnprocessableEntityException(
      'New password must be different then old one.',
    );
  return match;
};

export const checkPassword = async (attemptPass: string, password: string) => {
  const match = await compare(attemptPass, password);
  if (!match) throw 'Invalid credentials!';
  return match;
};

export const imageFileFilter = (req: any, file: any, callback: any) => {
  const type = file.mimetype.split('/');
  if (type[0] !== 'image') {
    req.fileValidationError = 'only image files allowed';
    return callback(null, false);
  }
  callback(null, true);
};

export const videoFileFilter = (req: any, file: any, callback: any) => {
  const type = file.mimetype.split('/');
  if (type[0] !== 'video') {
    req.fileValidationError = 'only video files allowed';
    return callback(null, false);
  }
  callback(null, true);
};

export const codeGenration = (prefix: string = '') => {
  return prefix + Math.floor(100000 + Math.random() * 130806).toString();
};

export const idGenration = () => {
  return Math.floor(100000 + Math.random() * 130806).toString();
};

export const expDate = () => {
  const expDate = new Date();
  expDate.setHours(expDate.getHours() + 24);
  return expDate;
};

export const generateRandomPassword = async () => {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  const allCharacters = uppercaseLetters + lowercaseLetters + numbers;

  let password = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters.charAt(randomIndex);
  }
  return password;
};

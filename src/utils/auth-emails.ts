import { sendEmail } from 'src/config/nodemailer';
import { masterTemplate } from './email-template';

export const verificationCodeEmail = async (data: any): Promise<any> => {
  const subject = 'Verification Code';
  const content = `<span style="font-size: 16px;color: #000000;">Your OTP code is ${data.code}</span>`;
  const body = masterTemplate(subject, content);
  return sendEmail(data.email, subject, body);
};

export const sendPasswordEmail = async (data: any): Promise<any> => {
  const subject = 'Welcome to Project!';
  const content = `<span style="font-size: 16px;color: #000000;">Your password is ${data.password}</span>`;
  const body = masterTemplate(subject, content);
  return sendEmail(data.email, subject, body);
};

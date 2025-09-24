import { Transporter, createTransport } from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import { getConfigVar } from 'src/utils/config';

export const sendEmail = async (
  recipientEmail: string,
  subject: string,
  body: string,
): Promise<any> => {
  const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: getConfigVar('SES_REGION'),
    credentials: {
      accessKeyId: getConfigVar('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getConfigVar('AWS_SECRET_KEY'),
    },
  });
  const mailerClient: Transporter = createTransport({
    SES: { ses, aws },
  });

  return await mailerClient
    .sendMail({
      from: getConfigVar('SES_FROM_MAIL'),
      to: recipientEmail,
      subject: subject,
      html: body,
    })
    .catch((err) => {
      console.log(err, 'Error');
    });
};

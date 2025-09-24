import { BadRequestException } from '@nestjs/common';
import * as sendGrid from '@sendgrid/mail';
import { getConfigVar } from 'src/utils/config';

export const sendEmail = (
  recipientEmail: string,
  subject: string,
  body: string,
): Promise<any> => {
  sendGrid.setApiKey(getConfigVar('SENDGRID_API_KEY'));
  const params = {
    to: recipientEmail,
    from: getConfigVar('FROM_EMAIL'),
    subject: subject,
    html: body,
  };
  return sendGrid
    .send(params)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new BadRequestException(err.message);
    });
};

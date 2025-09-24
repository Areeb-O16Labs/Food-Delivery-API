import { Logger } from '@nestjs/common';
import { messaging } from 'firebase-admin';

export const sendNotification = async (
  title: string,
  body: string,
  deviceTokens: string[],
  data: any,
): Promise<boolean> => {
  const notification_options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  const notification = {
    notification: {
      title: title,
      body: body,
    },
    data: data,
  };

  try {
    const uniqueTokens = Array.from(new Set(deviceTokens));

    const response = await messaging().sendToDevice(
      uniqueTokens,
      notification,
      notification_options,
    );
    Logger.log(response, 'Notification Response');
    // Check for errors in the response
    response.results.forEach((result, index) => {
      if (result.error) {
        Logger.error(
          `Error sending message to device token ${uniqueTokens[index]}:`,
          result.error,
        );
      }
    });
  } catch (err) {
    Logger.error(err, 'Notification');
  }

  return true;
};

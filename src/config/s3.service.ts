import { v4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { getConfigVar } from 'src/utils/config';

@Injectable()
export class AwsService {
  async uploadS3(file, type, path) {
    AWS.config.update({
      accessKeyId: getConfigVar('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getConfigVar('AWS_SECRET_KEY'),
    });
    if (
      type ==
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      type = 'application/docx';
    const urlKey = `${Date.now().toString()}-${v4()}.${type.split('/')[1]}`;
    const s3 = new AWS.S3();
    const params = {
      Bucket: getConfigVar('AWS_S3_BUCKET_NAME'),
      Key: path + '/' + urlKey,
      Body: file,
      ContentType: type,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async removeFromS3(name: string) {
    AWS.config.update({
      accessKeyId: getConfigVar('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getConfigVar('AWS_SECRET_KEY'),
      region: 'us-west-2',
    });
    const s3 = new AWS.S3();
    return new Promise((resolve, reject) => {
      s3.deleteObject(
        {
          Bucket: getConfigVar('AWS_S3_BUCKET_NAME'),
          Key: name,
        },
        (err, data) => {
          if (err) {
            Logger.error(err);
            reject(err.message);
          }
          resolve(data);
        },
      );
    });
  }
}

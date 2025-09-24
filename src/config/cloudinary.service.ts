import { Injectable, Logger } from '@nestjs/common';
import { ResourceType, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file, path): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: path,
          },
          async (error, result) => {
            if (error) {
              Logger.error(error);
              reject(error.message);
            }
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadVideo(file, path): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            resource_type: 'video',
            folder: path,
          },
          async (error, result) => {
            if (error) {
              Logger.error(error);
              reject(error.message);
            }
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async removeUpload(file, type: ResourceType): Promise<any> {
    const keys = file.split(/[ \/.\)]+/);
    const path = keys[keys.length - 3] + '/' + keys[keys.length - 2];
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        path,
        {
          resource_type: type,
        },
        async (error, result) => {
          if (error) {
            Logger.error(error);
            reject(error.message);
          }
          resolve(result);
        },
      );
    });
  }
}

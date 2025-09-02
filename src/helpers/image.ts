import cloudinary from '@/config/cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

function assertImageUploaded(
  file: UploadApiResponse | undefined
): asserts file is UploadApiResponse {
  if (file === undefined) {
    throw new Error('Not an image');
  }
}

const uploadNewImage = async (
  file: File
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<UploadApiResponse | UploadApiErrorResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'parche-chat',
            tags: 'parche-chat',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) {
              assertImageUploaded(result);
              resolve(result);
            }
          }
        )
        .end(buffer);
    }
  );

  return result;
};

export default uploadNewImage;

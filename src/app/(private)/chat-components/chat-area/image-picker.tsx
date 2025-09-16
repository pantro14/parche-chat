import { Modal, Upload } from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface ImagePickerProps {
  showImagePicker: boolean;
  setShowImagePicker: Dispatch<SetStateAction<boolean>>;
  imageFiles: File[];
  setImageFiles: Dispatch<SetStateAction<File[]>>;
  uploading: boolean;
  onSend: () => void;
}

function ImagePicker({
  showImagePicker,
  setShowImagePicker,
  imageFiles,
  setImageFiles,
  uploading = false,
  onSend,
}: ImagePickerProps) {
  return (
    <Modal
      open={showImagePicker}
      onCancel={() => setShowImagePicker(false)}
      title={
        <span className='text-xl font-semibold text-center text-primary'>
          Select an Image
        </span>
      }
      centered
      okText='Send'
      okButtonProps={{ disabled: imageFiles.length === 0, loading: uploading }}
      onOk={onSend}
    >
      <Upload
        listType='picture-card'
        beforeUpload={(file) => {
          setImageFiles([...imageFiles, file]);
          return false;
        }}
      >
        <span className='text-gray-400 text-xs cursor-pointer'>
          Upload your pictures
        </span>
      </Upload>
    </Modal>
  );
}

export default ImagePicker;

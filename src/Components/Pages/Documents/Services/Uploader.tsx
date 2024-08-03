import React from 'react';
import { Upload, message, Typography } from 'antd';
import { UploadProps } from 'antd/es/upload';
import Box from '@mui/material/Box';
import { LuHardDriveUpload } from 'react-icons/lu';

const { Dragger } = Upload;

type UploaderProps = {
  setFileUrl: (url: string) => void;
};

const Uploader: React.FC<UploaderProps> = ({ setFileUrl }) => {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://localhost:4444/upload/file', // Your backend URL
    beforeUpload(file) {
      const isDocxOrPdf = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isDocxOrPdf) {
        message.error('You can only upload DOCX or PDF files!');
        return Upload.LIST_IGNORE;
      }
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('File must be smaller than 50MB!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange(info) {
      const { status, response } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        if (response?.url) {
          setFileUrl(response.url); // Set the file URL on successful upload
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Dragger {...props}>
      <Box className="flex justify-center my-5">
        <LuHardDriveUpload style={{ fontSize: '50px', color: 'blue' }} />
      </Box>
      <Typography style={{ fontSize: '18px', color: '#000', fontFamily: 'Kanit' }}>
        คลิ๊กหรือลากวางไฟล์ลงตรงนี้
      </Typography>
      <Typography style={{ fontSize: '12px', color: '#5d5d5d', fontFamily: 'Kanit' }}>
        รองรับไฟล์สกุล .PDF และ .DOCX เท่านั้น ขนาดไม่เกิน 50 MB.
      </Typography>
    </Dragger>
  );
};

export default Uploader;

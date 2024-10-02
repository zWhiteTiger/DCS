import React from 'react';
import { Upload, message, Typography } from 'antd';
import { UploadProps } from 'antd/es/upload';
import Box from '@mui/material/Box';
import { LuHardDriveUpload } from 'react-icons/lu';

const { Dragger } = Upload;

type UploaderProps = {
  setFileUrl: (url: string) => void;
  nextStep: () => void;
};

const Uploader: React.FC<UploaderProps> = ({ setFileUrl, nextStep }) => {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: `${import.meta.env.VITE_URL}/doc`, // URL ของ Backend ของคุณ
    withCredentials: true,
    accept: '.pdf,.docx',
    data: (file) => ({
      doc_name: file.name,
    }),
    beforeUpload(file) {
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        message.error('ไฟล์ต้องเป็น .PDF เท่านั้น!');
        return Upload.LIST_IGNORE;
      }
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('ขนาดไฟล์ต้องน้อยกว่า 50MB');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange(info) {
      const { status, response } = info.file;
      if (status === 'done') {
        message.success(`อัพโหลด ${info.file.name} เสร็จสิ้น`);
        if (response?.url) {
          setFileUrl(response.url);
          nextStep()
        }
      } else if (status === 'error') {
        message.error(`อัพโหลดไฟล์ ${info.file.name} ล้มเหลว`);
      }
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
        รองรับไฟล์สกุล .PDF เท่านั้น ขนาดไม่เกิน 50 MB.
      </Typography>
    </Dragger>
  );
};

export default Uploader;

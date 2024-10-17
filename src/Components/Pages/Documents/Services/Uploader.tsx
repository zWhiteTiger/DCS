import React, { useState } from 'react';
import { Upload, message, Typography, Spin } from 'antd';
import { UploadProps } from 'antd/es/upload';
import Box from '@mui/material/Box';
import { LuHardDriveUpload } from 'react-icons/lu';
import { useAppDispatch } from '../../../../Store/Store';
import { setDocumentId } from '../../../../Store/Slices/DocSlice'; // Import the relevant actions
import { setPath } from '../../../../Store/Slices/pathSlice';

const { Dragger } = Upload;

type UploaderProps = {
  setFileUrl: (url: string) => void;
  nextStep: () => void;
  setDocId: React.MutableRefObject<string | null>
};

const Uploader: React.FC<UploaderProps> = ({ setFileUrl, nextStep, setDocId }) => {
  const [loading, setLoading] = useState(false);  // State to control loading status
  const disPatch = useAppDispatch();

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: `${import.meta.env.VITE_URL}/doc`, // Backend URL
    withCredentials: true,
    accept: '.pdf',
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
      setLoading(true); // Set loading status
      return true;
    },
    onChange(info) {
      const { status, response } = info.file;
      if (status === 'done') {
        message.success(`อัพโหลด ${info.file.name} เสร็จสิ้น`);
        setLoading(false);  // Turn off loading status

        if (response?.url && response?.docID) {
          // Update local component state
          setFileUrl(response.url);
          setDocId.current = response.docID;

          // Dispatch global state updates
          disPatch(setPath(response.url));
          disPatch(setDocumentId(response.docID));

          // Proceed to the next step
          nextStep();
        }
      } else if (status === 'error') {
        message.error(`อัพโหลดไฟล์ ${info.file.name} ล้มเหลว`);
        setLoading(false);  // Turn off loading status
      }
    },
  };

  return (
    <Spin spinning={loading} tip="กำลังอัพโหลด...">
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
    </Spin>
  );
};

export default Uploader;

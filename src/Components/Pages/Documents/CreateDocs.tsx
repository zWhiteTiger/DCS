import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, styled } from '@mui/material';
import { Steps, Button, message, Divider } from 'antd';
import Uploader from './Services/Uploader';
import PDFServices from './Services/PDFServices';
import NoMoreContent from '../Utility/NoMoreContent';

const CreateDocs: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileUrl, setFileUrl] = useState<string>('');

  const StyledCard = styled(Card)(({ theme }) => ({
    border: '1px solid #d5d5d5',
    width: '100%',
    boxSizing: 'border-box',
  }));

  const steps = [
    {
      title: <Typography>อัพโหลดไฟล์</Typography>,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">ขั้นตอนที่ 1 อัพโหลดไฟล์</Typography>
            <Typography>รองรับไฟล์สกุล .PDF และ .DOCX เท่านั้น และ ไฟล์จะต้องมีขนาดไม่เกิน 50 MB.</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box className="p-9">
              <Uploader setFileUrl={setFileUrl} />
            </Box>
          </Grid>
        </Grid>
      ),
    },
    {
      title: <Typography>แก้ไข</Typography>,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography variant="h4">ขั้นตอนที่ 2 แก้ไขเอกสาร</Typography>
            <Typography>แก้ไขเอกสารหรือเพิ่มผู้ลงนาม</Typography>
            {/* Display PDF if fileUrl is set */}
            <StyledCard>
              <PDFServices />
            </StyledCard>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5">เลือกบล๊อคคำสั่ง</Typography>
          </Grid>
          <Grid item xs={9}>
            {/* Content for Step 2 */}
          </Grid>
        </Grid>
      ),
    },
    {
      title: <Typography>ดำเนินการส่งเอกสาร</Typography>,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography variant="h4">ขั้นตอนที่ 3 ดำเนินการส่งเอกสาร</Typography>
            <Typography>ตรวจสอบความเรียบร้อยก่อนส่งเอกสาร</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5">รายชื่อผู้ลงนาม</Typography>
          </Grid>
          <Grid item xs={9}>
            {/* Content for Step 3 */}
          </Grid>
        </Grid>
      ),
    },
  ];

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleDone = () => {
    message.success({
      content: 'ดำเนินการเอกสารเสร็จสิ้น',
      className: 'ant-message-custom-style',
    });
  };

  return (
    <>
      <Card style={{ borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0)', padding: '25px' }}>
        <CardContent>
          <Steps current={currentStep}>
            {steps.map((step, index) => (
              <Steps.Step key={index.toString()} title={step.title} />
            ))}
          </Steps>
          <div style={{ marginTop: '20px' }}>{steps[currentStep].content}</div>
          <div style={{ marginTop: '20px' }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: '10px', color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }} onClick={prevStep}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={nextStep} style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={handleDone} style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}>
                Done
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <NoMoreContent />
    </>
  );
};

export default CreateDocs;

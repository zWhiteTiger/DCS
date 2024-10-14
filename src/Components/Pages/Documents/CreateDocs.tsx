import React, { useRef, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, styled } from '@mui/material';
import { Steps, Button, Form, Select, FormProps, Modal } from 'antd';
import NoMoreContent from '../Utility/NoMoreContent';
import PDFServices from './Services/PDFServices';
import Uploader from './Services/Uploader';

type publicType = {
  isStatus: string;
};

const CreateDocs: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileUrl, setFileUrl] = useState<string>('');
  const docIdRef = useRef<string | null>(null)

  const StyledCard = styled(Card)(({ }) => ({
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
  }));

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (value: string) => {
    console.log(`Selected: ${value}`);
  };

  const onFinish: FormProps<publicType>['onFinish'] = async (values) => {
    // Add the public field to values
    const dataToSend = {
      ...values,
      public: true, // Set public to true by default
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/doc/${docIdRef.current}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Send data with the public field included
      });

      const data = await response.json();
      console.log('API Response:', data); // Log response data for debugging

      if (response.status === 201) {
        Modal.success({
          title: 'สร้างบัญชีใหม่เสร็จสิ้น',
          content: 'สร้างบัญชีใหม่เสร็จสิ้น เข้าสู่ระบบเพื่อดำเนินการต่อ',
          okText: 'เข้าสู่ระบบ',
          okButtonProps: {
            style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
          },
          // onOk: () => navigate('/create'), // Redirect to login page on success
        });
      } else {
        if (data.errorCode === 'EMAIL_EXISTS') {
          Modal.error({
            title: 'ผู้ใช้นี้ถูกใช้งานไปแล้ว',
            content: 'อีเมลนี้ถูกใช้ไปแล้ว กรุณาใช้อีเมลอื่น',
            okText: 'ลองใหม่อีกครั้ง',
            okButtonProps: {
              style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
            }
          });
        } else {
          Modal.error({
            title: 'ลงทะเบียนไม่สำเร็จ',
            content: 'ชื่อผู้ใช้นี้ถูกใช้งานไปแล้ว',
            okText: 'ลองใหม่อีกครั้ง',
            okButtonProps: {
              style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Modal.error({
        title: 'ลงทะเบียนไม่สำเร็จ',
        content: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
        okText: 'ลองใหม่อีกครั้ง',
        okButtonProps: {
          style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
        }
      });
    }
  };

  const onFinishFailed: FormProps<publicType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    Modal.error({
      title: 'ข้อมูลไม่ครบ',
      content: 'โปรดกรอกข้อมูลให้ครบถ้วนและตรวจสอบรหัสผ่านให้ตรงกัน',
      okText: 'ลองใหม่อีกครั้ง',
      okButtonProps: {
        style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
      }
    });
  };

  const steps = [
    {
      title: <Typography>อัพโหลดไฟล์</Typography>,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">ขั้นตอนที่ 1 อัพโหลดไฟล์</Typography>
            <Typography>รองรับไฟล์สกุล .PDF เท่านั้น และ ไฟล์จะต้องมีขนาดไม่เกิน 50 MB.</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box className="p-9">
              <Uploader
                nextStep={nextStep}
                setDocId={docIdRef}
                setFileUrl={(url: string) => {
                  setFileUrl(url);
                  setCurrentStep(1); // Automatically move to Step 2
                }}

              />
            </Box>
          </Grid>
        </Grid>
      ),
    },
    {
      title: <Typography>แก้ไข</Typography>,
      content: (
        <Box>
          <Typography variant="h4">ขั้นตอนที่ 2 แก้ไขเอกสาร</Typography>
          <Typography>แก้ไขเอกสารหรือเพิ่มผู้ลงนาม</Typography>
          <StyledCard>
            {fileUrl ? <PDFServices fileUrl={fileUrl} /> :
              <Box className='flex justify-center' style={{ backgroundColor: '#ec4649', color: '#FFFFFF', height: '100px' }}>
                <Typography className='mt-9'>กรุณาอัพโหลดไฟล์ก่อน</Typography>
              </Box>
            }
          </StyledCard>
        </Box>
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

            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<publicType>
                name="isStatus"
                rules={[{ required: true, message: 'โปรดเลือกเพศของคุณ' }]}
              >
                <Select
                  size='large'
                  placeholder="ประเภทหนังสือ"
                  defaultValue={'unread'}
                  style={{ width: '100%', fontFamily: 'Kanit' }}
                  onChange={handleChange}
                  options={[
                    { value: 'unread', label: 'หนังสือทั่วไป' },
                    { value: 'express', label: 'หนังสือด่วน' },
                  ]}
                />
              </Form.Item>
            </Form>

          </Grid>
        </Grid>
      ),
    },
  ];

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
              <>
                {currentStep > 1 && (
                  <Button size='large' style={{ marginRight: '10px', color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }} onClick={prevStep}>
                    ก่อนหน้า
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button size='large' type="primary" onClick={nextStep} style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}>
                    ถัดไป
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button size='large' type="primary" htmlType="submit" style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}>
                    เสร็จสิ้น
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <NoMoreContent />
    </>
  );
};

export default CreateDocs;
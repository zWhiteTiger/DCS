import React, { useRef, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, styled } from '@mui/material';
import { Steps, Button, Form, Select, FormProps, Modal } from 'antd';
import NoMoreContent from '../Utility/NoMoreContent';
import PDFServices from './Services/PDFServices';
import Uploader from './Services/Uploader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { httpClient } from '../Utility/HttpClient';
import { useNavigate } from 'react-router-dom';

type publicType = {
  isStatus: string;
};

const CreateDocs: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileUrl, setFileUrl] = useState<string>('');
  const docIdRef = useRef<string | null>(null)

  const formRef = useRef<any>(null); // Create a reference for the form
  const navigate = useNavigate();

  const documentId = useSelector((state: RootState) => state.docsReducer.documentId);

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
    const dataToSend = {
      ...values,
      public: true, // Set public to true by default
    };

    try {

      const response = await httpClient.patch(`/doc/${documentId}`, dataToSend);
      Modal.success({
        title: 'นำส่งเอกสารเสร็จสิ้น',
        content: 'ระบบได้ทำการนำส่งเอกสารไปยังผู้ลงนามแล้ว',
        okText: 'ตกลง',
        okButtonProps: {
          style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
        },
        onOk: () => {
          // เมื่อกดปุ่ม 'ตกลง' ให้ทำการเปลี่ยนหน้าไปยัง '/explore'
          navigate('/explore');
        }
      });
      return response.data
    } catch (error) {
      Modal.error({
        title: 'ข้อมูลไม่ครบ',
        content: 'โปรดกรอกข้อมูลให้ครบถ้วนและตรวจสอบรหัสผ่านให้ตรงกัน',
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
            {fileUrl ? <PDFServices fileUrl={fileUrl} docId={documentId} /> :
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
              ref={formRef} // Add this line
              name="patchForm"
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
                rules={[{ required: true, message: 'โปรดเลือกประเภทของเอกสาร' }]}
              >
                <Select
                  size='large'
                  placeholder="ประเภทหนังสือ"
                  style={{ width: '100%', fontFamily: 'Kanit' }}
                  onChange={handleChange}
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'express', label: 'Express' },
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
                  <Button size='large' type="primary"
                    onClick={() => {
                      formRef.current.submit();
                    }}
                    style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}>
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
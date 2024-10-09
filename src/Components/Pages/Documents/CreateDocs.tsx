import React, { useRef, useState } from 'react'
import { Grid, Card, CardContent, Typography, Box, styled } from '@mui/material'
import { Steps, Button, message } from 'antd'
import NoMoreContent from '../Utility/NoMoreContent'
import PDFServices from './Services/PDFServices'
import Uploader from './Services/Uploader'

const CreateDocs: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [fileUrl, setFileUrl] = useState<string>('')
  // const [docId, setDocId] = useState<string | null>(null)
  const docIdRef = useRef<string | null>(null)
  const StyledCard = styled(Card)(({}) => ({
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
  }))

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleDone = () => {
    message.success({
      content: 'ดำเนินการเอกสารเสร็จสิ้น',
      className: 'ant-message-custom-style',
    })
  }

  // console.log(docIdRef.current)
  // 670669b81732907abf54c64b

  const steps = [
    {
      title: <Typography>อัพโหลดไฟล์</Typography>,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>ขั้นตอนที่ 1 อัพโหลดไฟล์</Typography>
            <Typography>
              รองรับไฟล์สกุล .PDF เท่านั้น และ ไฟล์จะต้องมีขนาดไม่เกิน 50 MB.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box className='p-9'>
              <Uploader
                nextStep={nextStep}
                setFileUrl={(url: string) => {
                  setFileUrl(url)
                  setCurrentStep(1) // Automatically move to Step 2
                }}
                setDocId={docIdRef}
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
          <Typography variant='h4'>ขั้นตอนที่ 2 แก้ไขเอกสาร</Typography>
          <Typography>แก้ไขเอกสารหรือเพิ่มผู้ลงนาม</Typography>
          <StyledCard>
            {fileUrl ? (
              <PDFServices fileUrl={fileUrl} docId={docIdRef.current} />
            ) : (
              <Box
                className='flex justify-center'
                style={{
                  backgroundColor: '#ec4649',
                  color: '#FFFFFF',
                  height: '100px',
                }}
              >
                <Typography className='mt-9'>กรุณาอัพโหลดไฟล์ก่อน</Typography>
              </Box>
            )}
          </StyledCard>
        </Box>
      ),
    },
    {
      title: <Typography>ดำเนินการส่งเอกสาร</Typography>,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography variant='h4'>
              ขั้นตอนที่ 3 ดำเนินการส่งเอกสาร
            </Typography>
            <Typography>ตรวจสอบความเรียบร้อยก่อนส่งเอกสาร</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant='h5'>รายชื่อผู้ลงนาม</Typography>
          </Grid>
        </Grid>
      ),
    },
  ]

  return (
    <>
      <Card
        style={{
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0)',
          padding: '25px',
        }}
      >
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
                  <Button
                    size='large'
                    style={{
                      marginRight: '10px',
                      color: 'white',
                      backgroundColor: '#4318FF',
                      fontFamily: 'Kanit',
                    }}
                    onClick={prevStep}
                  >
                    ก่อนหน้า
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button
                    size='large'
                    type='primary'
                    onClick={nextStep}
                    style={{
                      color: 'white',
                      backgroundColor: '#4318FF',
                      fontFamily: 'Kanit',
                    }}
                  >
                    ถัดไป
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    size='large'
                    type='primary'
                    onClick={handleDone}
                    style={{
                      color: 'white',
                      backgroundColor: '#4318FF',
                      fontFamily: 'Kanit',
                    }}
                  >
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
  )
}

export default CreateDocs

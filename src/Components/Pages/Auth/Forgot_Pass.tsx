import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';
import axios from 'axios';
import '../Styles/style.css';

const antdTheme = createTheme({
  typography: {
    fontFamily: [
      'Kanit',
      'sans-serif',
    ].join(','),
  },
});

export default function ForgotPassword() {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const response = await axios.post('http://localhost:4444/auth/forgot-password', values);

      if (response.status === 200) {
        showSuccessModal('สำเร็จ', 'ลิงก์รีเซ็ตรหัสผ่านได้ถูกส่งไปที่อีเมลของท่านแล้ว');
      } else {
        showErrorModal('ไม่พบอีเมลนี้ในระบบ', 'โปรดตรวจสอบอีเมลของท่านและลองอีกครั้ง');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showErrorModal('เกิดข้อผิดพลาด', 'ไม่สามารถส่งอีเมลได้ โปรดลองอีกครั้ง');
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const showErrorModal = (title: string, subtitle: string) => {
    Modal.error({
      title,
      content: subtitle,
      okText: 'ตกลง',
      okButtonProps: {
        style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
      },
    });
  };

  const showSuccessModal = (title: string, subtitle: string) => {
    Modal.success({
      title,
      content: subtitle,
      okText: 'ตกลง',
      okButtonProps: {
        style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
      },
      onOk() {
        navigate('/auth/login'); // Navigate back to login page after success
      },
    });
  };

  type FieldType = {
    email?: string;
  };

  return (
    <ThemeProvider theme={antdTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/background/Document.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 10,
              mx: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography className='mt-10' component="h1" variant="h5">
              ลืมรหัสผ่าน
            </Typography>
            <Form
              className='mt-10'
              name="forgotPasswordForm"
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                name="email"
                rules={[{ required: true, message: 'โปรดป้อนที่อยู่อีเมล' }]}
              >
                <Input
                  size='large'
                  style={{ fontFamily: 'Kanit' }}
                  placeholder="อีเมล"
                />
              </Form.Item>

              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  size='large'
                  htmlType="submit"
                  style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}
                >
                  ส่งคำขอลืมรหัสผ่าน
                </Button>
              </Form.Item>
            </Form>

            <Box className="mt-10">
              <Box className="flex justify-start my-2">
                <Link to="/auth/login">
                  <Button
                    size='large'
                    style={{ fontFamily: 'Kanit', color: 'black' }}
                    type="link">กลับไปที่หน้าเข้าสู่ระบบ</Button>
                </Link>
              </Box>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

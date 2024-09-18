import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { Button, DatePicker, Form, Input, Select, Space, Modal } from 'antd';
import type { DatePickerProps, FormProps } from 'antd';
import '../Styles/style.css';


const theme = createTheme({
  typography: {
    fontFamily: [
      "Kanit", "sans-serif",
    ].join(','),
  },
});

const handleChange = (value: string) => {
  console.log(`Selected: ${value}`);
};

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  birthDate?: string;
  gender?: string;
};

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

export default function Register() {
  const navigate = useNavigate(); // Initialize the navigate function

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const response = await fetch('http://localhost:4444/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log('API Response:', data); // Log response data for debugging

      if (response.status === 201) {
        // Handle successful registration
        Modal.success({
          title: 'สร้างบัญชีใหม่เสร็จสิ้น',
          content: 'สร้างบัญชีใหม่เสร็จสิ้น เข้าสู่ระบบเพื่อดำเนินการต่อ',
          okText: 'เข้าสู่ระบบ',
          okButtonProps: {
            style: { color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }
          },
          onOk: () => navigate('/auth/login'), // Redirect to login page on success
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

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
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

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/background/register.jpg)',
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
            <Typography component="h1" variant="h5">
              สร้างบัญชีใหม่
            </Typography>

            <Box sx={{ mt: 10 }}>
              <Form
                name="basic"
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Space direction="horizontal">
                  <Form.Item<FieldType>
                    name="firstName"
                    rules={[{ required: true, message: 'โปรดป้อนชื่อจริง' }]}
                  >
                    <Input
                      size='large'
                      style={{ fontFamily: 'Kanit' }}
                      placeholder="ชื่อจริง"
                    />
                  </Form.Item>

                  <Form.Item<FieldType>
                    name="lastName"
                    rules={[{ required: true, message: 'โปรดป้อนนามสกุล' }]}
                  >
                    <Input
                      size='large'
                      style={{ fontFamily: 'Kanit' }}
                      placeholder="นามสกุล"
                    />
                  </Form.Item>
                </Space>

                <Form.Item<FieldType>
                  name="email"
                  rules={[
                    { required: true, message: 'โปรดป้อนอีเมล' },
                    {
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'อีเมลไม่ถูกต้อง'
                    }
                  ]}
                >
                  <Input
                    size='large'
                    style={{ fontFamily: 'Kanit' }}
                    placeholder="ที่อยู่อีเมล"
                  />
                </Form.Item>

                <Form.Item<FieldType>
                  name="password"
                  rules={[
                    { required: true, message: 'โปรดป้อนรหัสผ่าน' },
                    { min: 8, message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว' }
                  ]}
                >
                  <Input.Password
                    size='large'
                    className="custom-input-password"
                    placeholder="รหัสผ่าน"
                    style={{ fontFamily: 'Kanit' }}
                  />
                </Form.Item>

                <Form.Item<FieldType>
                  name="confirmPassword"
                  dependencies={['password']}
                  className="custom-input-password"
                  rules={[
                    { required: true, message: 'โปรดป้อนรหัสผ่านยืนยัน' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('รหัสผ่านและรหัสผ่านยืนยันจะต้องตรงกัน'));
                      }
                    })
                  ]}
                >
                  <Input.Password
                    size='large'
                    placeholder="รหัสผ่านยืนยัน"
                  />
                </Form.Item>

                <Space direction="horizontal">
                  <Form.Item<FieldType>
                    name="birthDate"
                    rules={[{ required: true, message: 'โปรเลือกวันเดือนปีเกิดของคุณ' }]}
                  >
                    <DatePicker
                      style={{ fontFamily: 'Kanit', width: '100%' }}
                      placeholder="วันเดือนปีเกิด"
                      size='large'
                      onChange={onChange}
                    />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name="gender"
                    rules={[{ required: true, message: 'โปรดเลือกเพศของคุณ' }]}
                  >
                    <Select
                      size='large'
                      placeholder="เพศ"
                      style={{ width: '100%', fontFamily: 'Kanit' }}
                      onChange={handleChange}
                      options={[
                        { value: 'male', label: 'ชาย' },
                        { value: 'female', label: 'หญิง' },
                        { value: 'nonBinary', label: 'ไม่ระบุ' },
                      ]}
                    />
                  </Form.Item>
                </Space>

                <Box className="my-10" />

                <Form.Item style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    size='large'
                    htmlType="submit"
                    style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}
                  >
                    ลงทะเบียน
                  </Button>
                </Form.Item>
              </Form>

              <Box className="flex justify-start my-2">
                <Link to="/auth/login">
                  <Button
                    icon={<FaArrowLeft />}
                    size='large'
                    style={{ fontFamily: 'Kanit', color: 'black' }}
                    type="link"
                  >
                    คุณมีบัญชีอยู่แล้วใช่หรือไม่?, เข้าสู่ระบบ
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

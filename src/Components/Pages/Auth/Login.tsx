import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';
import { FaKey } from 'react-icons/fa';
import { MdCreate } from 'react-icons/md';
import axios from 'axios';
import '../Styles/style.css';
import { profile } from '../../../Hooks/useProfile';
import { useAppDispatch } from '../../../Store/Store';
import { setIsLogin, setProfile } from '../../../Store/Slices/authSlice';

const antdTheme = createTheme({
  typography: {
    fontFamily: [
      'Kanit',
      'sans-serif',
    ].join(','),
  },
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/auth/login`, values, { withCredentials: true });

      if (response.status === 201) {
        // Fetch the profile after a successful login
        const profileData = await profile();
        dispatch(setProfile(profileData));
        dispatch(setIsLogin());
  
        navigate('/'); // Redirect to the dashboard or homepage
      } else {
        showErrorModal('ไม่พบบัญชีนี้ในฐานข้อมูล', 'โปรดตรวจสอบอีเมลและรหัสผ่านของท่านใหม่และลองอีกครั้ง');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          showErrorModal('ผิดพลาดในการเข้าสู่ระบบ', 'อีเมลหรือรหัสผ่านผิด');
        } else {
          showErrorModal('ไม่พบบัญชีนี้ในฐานข้อมูล', 'โปรดตรวจสอบอีเมลและรหัสผ่านของท่านใหม่และลองใหม่อีกครั้ง');
        }
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

  type FieldType = {
    email?: string;
    password?: string;
    remember?: boolean;
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
              เข้าสู่ระบบ
            </Typography>
            <Form
              className='mt-10'
              name="loginForm"
              style={{ maxWidth: 600 }}
              initialValues={{ remember: false }}
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
                // defaultValue={"nattawut.sa@ksu.ac.th"}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'โปรดป้อนรหัสผ่าน' }]}
              >
                <Input.Password
                  size="large"
                  style={{ fontFamily: 'Kanit' }} // Change font for the input field
                  className="custom-input-password" // Add a custom class for styling
                  placeholder="รหัสผ่าน"
                // defaultValue="1430501488302"
                />
              </Form.Item>

              <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
              >
                <Checkbox
                  style={{ fontFamily: 'Kanit' }}
                >
                  โปรดจดจำ ฉัน
                </Checkbox>
              </Form.Item>

              <Box className="my-10 w-[350px]" />

              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  size='large'
                  htmlType="submit"
                  style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}
                >
                  เข้าสู่ระบบ
                </Button>
              </Form.Item>
            </Form>

            <Box className="mt-10">
              <Box className="flex justify-start my-2">
                <Link to="/auth/forgetpassword" style={{ marginRight: '10px' }}>
                  <Button
                    icon={<FaKey />}
                    size='large'
                    style={{ fontFamily: 'Kanit', color: 'black' }}
                    type="link">ลืมรหัสผ่าน?</Button>
                </Link>
              </Box>
              <Box className="w-[350px]"></Box>
              <Box className="flex justify-start my-2">
                <Link to="/auth/register">
                  <Button
                    icon={<MdCreate />}
                    size='large'
                    style={{ fontFamily: 'Kanit', color: 'black' }}
                    type="link">ยังไม่มีบัญชี?, สร้างบัญชีใหม่</Button>
                </Link>
              </Box>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

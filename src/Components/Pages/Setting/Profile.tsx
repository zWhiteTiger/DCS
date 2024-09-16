import { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../Store/Slices/authSlice';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import NoMoreContent from '../Utility/NoMoreContent';
import UserDataEditor from './UserDataEditor';
import Signature from './Signature';

const { Dragger } = Upload;

const userinfo = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
};

const userEditor = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    textAlign: 'start',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
};

type Props = {};

export default function Profile({ }: Props) {
    const profileReducer = useSelector(authSelector);
    const [imageSrc, setImageSrc] = useState(profileReducer.result?.picture
        ? `http://localhost:4444${profileReducer.result.picture}`
        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');

    const handleFileChange = (info: any) => {
        if (info.file.status === 'done') {
            const newImageSrc = `http://localhost:4444${info.file.response.path}`;
            setImageSrc(newImageSrc);
            message.success({
                content: 'อัพโหลดเสร็จสิ้น, กำลังเปลี่ยนรูปภาพ',
                className: 'ant-message-custom-style',
            });
        } else if (info.file.status === 'error') {
            message.error({
                content: 'อัพโหลดล้มเหลว',
                className: 'ant-message-custom-style',
            });
        } else if (info.file.status === 'uploading') {
            // If the file is being uploaded, preview it before it's finished
            const file = info.file.originFileObj;
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    // const userId = profileReducer.result?._id;
    const userEmail = profileReducer.result?.email;

    const uploadProps = {
        name: 'file',
        action: `http://localhost:4444/upload/profile`,
        data: {
            email: userEmail,
        },
        withCredentials: true,
        onChange: handleFileChange,
        showUploadList: false,
        accept: '.png,.jpg,.jpeg',
    };

    return (
        <>
            <Box display="flex" width="100%">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={userinfo}>
                            <CardContent className="m-3">
                                <div style={{ width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '100%', position: 'relative' }}>
                                    <img src={imageSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <Dragger {...uploadProps} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                        <Button icon={<UploadOutlined />} style={{ color: '#FFFFFF' }} type="link">
                                            เปลี่ยนรูปประจำตัว
                                        </Button>
                                    </Dragger>
                                </div>
                                <Box className="mt-5">
                                    <Typography variant="h6" gutterBottom>
                                        {profileReducer.result?.firstName} {profileReducer.result?.lastName}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        รหัสนักศึกษา: 123456
                                    </Typography>
                                    <br />
                                    <Typography variant="h6">
                                        ตำแหน่ง
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        นักศึกษา
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Grid container spacing={2} direction="row">
                            <Grid item xs={12} sm={6}>
                                <Card sx={userEditor} style={{ padding: '16px' }}>
                                    <CardContent>
                                        <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>
                                            แก้ไขข้อมูลผู้ใช้งาน
                                        </Typography>
                                        <UserDataEditor />
                                    </CardContent>
                                </Card>
                                <Box className="mt-5" />
                                <Card sx={userEditor} style={{ padding: '16px' }}>
                                    <CardContent>
                                        <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>
                                            เปลี่ยนรหัสผ่าน
                                        </Typography>
                                        <Button>
                                            Change Password
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card sx={userEditor} style={{ padding: '16px' }}>
                                    <CardContent>
                                        <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>
                                            ลายเซนต์
                                        </Typography>

                                        <Signature />

                                        <Typography style={{ color: '#1B2559' }}>
                                            ลายเซนต์จะต้องเป็นภาพสกุลไฟล์ .PNG ที่ไม่มีพื้นหลัง
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <NoMoreContent />
        </>
    );
}

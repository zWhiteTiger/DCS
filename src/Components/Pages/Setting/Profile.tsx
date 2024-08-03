import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../Store/Slices/authSlice';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

const { Dragger } = Upload;

const userinfo = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
};

type Props = {};

export default function Profile({ }: Props) {
    const profileReducer = useSelector(authSelector);

    const handleFileChange = (info: any) => {
        if (info.file.status === 'done') {
            console.log('File uploaded successfully:', info.file);
        } else if (info.file.status === 'error') {
            console.error('File upload failed:', info.file);
        }
    };

    const userId = profileReducer.result?._id; 
    const userEmail = profileReducer.result?.email; // Extract email from profileReducer

    const uploadProps = {
        name: 'file',
        action: `http://localhost:4444/upload/profile`, // No need to include userId here
        data: {
            email: userEmail, // Pass the email in the request body
        },
        withCredentials: true,
        onChange: handleFileChange,
        showUploadList: false,
    };

    return (
        <Box display="flex" width="100%">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card sx={userinfo}>
                        <CardContent className="m-3">
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '100%', position: 'relative' }}>
                                <img
                                    src={`http://localhost:4444/profile/${userId}`}
                                    alt="User Avatar"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                                <Dragger {...uploadProps} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                    <Button icon={<UploadOutlined />} type="primary">Upload</Button>
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
                    <Card sx={userinfo} style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Additional Information
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Here you can add more details about the user or other relevant information.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

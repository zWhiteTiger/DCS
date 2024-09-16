import { useState } from 'react'
import { authSelector } from '../../../Store/Slices/authSlice';
import { useSelector } from 'react-redux';
import { Button, message } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { UploadOutlined } from '@mui/icons-material';

type Props = {}

export default function Signature({ }: Props) {

    const profileReducer = useSelector(authSelector);
    const [imageSrc, setImageSrc] = useState(profileReducer.result?.signature
        ? `http://localhost:4444/signature/${profileReducer.result.signature}` 
        : 'http://localhost:4444/signature/NoSignature/NoSignature.png');

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
        action: `http://localhost:4444/upload/signature`,
        data: {
            email: userEmail,
        },
        withCredentials: true,
        onChange: handleFileChange,
        showUploadList: false,
        accept: '.png',
    };

    console.log(profileReducer.result)
    return (
        <div style={{
            width: '100%', // Make the card responsive
            maxWidth: 'auto', // Set a maximum width for larger screens
            height: 'auto', // Let the height adjust automatically
            aspectRatio: '16/9', // Maintain aspect ratio of the image
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderRadius: '7px',
            position: 'relative'
        }}>
            <img
                src={imageSrc}
                alt="Profile"
                style={{
                    width: '100%', // Make the image fully responsive within the card
                    height: '100%', // Match the card height
                    objectFit: 'cover' // Ensure the image covers the card area
                }}
            />
            <Dragger
                {...uploadProps}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}
            >
                <Button
                    icon={<UploadOutlined />}
                    style={{ color: '#FFFFFF' }}
                    type="link"
                >
                    เพิ่มหรือเปลี่ยนลายเซนต์
                </Button>
            </Dragger>
        </div>

    )
}
import { useEffect, useState } from 'react';
import { Button, Modal, Tooltip, Select, message } from 'antd';
import { MdFileOpen } from 'react-icons/md';
import PDFServices from './Services/PDFServices';
import { Box, Card, styled } from '@mui/material';
import { useAppDispatch } from '../../../Store/Store';
import { docAsync } from '../../../Store/Slices/DocSlice';
import { httpClient } from '../Utility/HttpClient';

type PDFModalProps = {
    docsPath: string;  // Type for docsPath
    docId: string;
};

const PDFModal = ({ docsPath, docId }: PDFModalProps) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingButton, setLoadingButton] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null); // ใช้ useState แทน useRef เพื่อควบคุมการเปลี่ยนแปลง
    const [docType, setDocType] = useState<string>('standard'); // สร้าง state สำหรับเก็บประเภทของเอกสารที่เลือก

    const dispatch = useAppDispatch();

    const StyledCard = styled(Card)(() => ({
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
    }));

    const showModal = () => {
        setOpen(true);
        setFileUrl(`/pdf/${docsPath}`); // อัปเดต fileUrl เมื่อเปิด modal
    };

    const handleOk = async (button: string) => {
        setLoading(true);
        setLoadingButton(button);

        // ส่งคำขอ PATCH เพื่ออัปเดตข้อมูลเอกสาร
        try {
            await httpClient.patch(`/doc/${docId}`, {
                isStatus: docType,   // ใช้ค่า docType ที่ผู้ใช้เลือก
                public: true
            });
            message.success('อัปเดตสถานะเอกสารเรียบร้อย');
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการอัปเดตเอกสาร');
        } finally {
            setLoading(false);
            setLoadingButton(null);
            setOpen(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleTypeChange = (value: string) => {
        setDocType(value); // อัปเดตค่า docType เมื่อผู้ใช้เปลี่ยนการเลือกใน Dropdown
    };

    const tooltipStyle = { fontFamily: 'Kanit' };

    useEffect(() => {
        dispatch(docAsync(docsPath));
    }, [docsPath, dispatch]);

    return (
        <>
            <Tooltip title={<span style={tooltipStyle}>แก้ไขไฟล์</span>}>
                <Button
                    type="primary"
                    icon={<MdFileOpen />}
                    size="large"
                    style={{
                        fontFamily: 'Kanit',
                        color: 'white',
                        backgroundColor: '#4318FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={showModal}
                >
                    แก้ไข
                </Button>
            </Tooltip>

            <Modal
                open={open}
                onCancel={handleCancel}
                width={1550}
                style={{ zIndex: 1, marginTop: '-70px', border: 'none', boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', }}
                maskClosable={false}
                footer={[

                    <Box className="flex justify-end" style={{ alignItems: 'start' }}>
                        <div>
                            <label style={{ fontFamily: 'Kanit', fontSize: '16px', marginLeft: '10px' }}>เลือกประเภทเอกสาร:</label>
                            <Select size="large" defaultValue="standard" style={{ width: 200 }} onChange={handleTypeChange}>
                                <Select.Option value="standard">Standard</Select.Option>
                                <Select.Option value="express">Express</Select.Option>
                            </Select>
                        </div>
                        <Button
                            key="submit"
                            type="primary"
                            size='large'
                            style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit', marginLeft: '10px' }} // เพิ่ม margin เพื่อให้มีช่องว่างระหว่างปุ่มและ dropdown
                            loading={loadingButton === 'submit' && loading}
                            onClick={() => handleOk('submit')}
                        >
                            ส่งเอกสาร
                        </Button>
                    </Box>

                ]}
            >
                <StyledCard>
                    {fileUrl && (
                        <PDFServices
                            key={fileUrl} // ใช้ fileUrl เป็น key เพื่อบังคับให้ re-render
                            fileUrl={fileUrl}
                            docId={docId}
                        />
                    )}
                </StyledCard>
            </Modal>
        </>
    );
};

export default PDFModal;

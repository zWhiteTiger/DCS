import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import { MdFileOpen } from 'react-icons/md';
import PDFServices from './Services/PDFServices';
import { Box, Card, CardContent, Grid, styled, Typography } from '@mui/material';
import { useAppDispatch } from '../../../Store/Store';
import { docAsync, docSelector } from '../../../Store/Slices/DocSlice';
import { useSelector } from 'react-redux';

type PDFModalProps = {
    docsPath: string;  // Type for docsPath
};

const PDFModal = ({ docsPath }: PDFModalProps) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingButton, setLoadingButton] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null); // ใช้ useState แทน useRef เพื่อควบคุมการเปลี่ยนแปลง
    const [approvers, setApprovers] = useState<string[]>([]);

    const docReducer = useSelector(docSelector)

    console.log(docReducer.result?.docsPath)

    const dispatch = useAppDispatch()

    const StyledCard = styled(Card)(() => ({
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
    }));

    const showModal = () => {
        setOpen(true);
        setFileUrl(`/pdf/${docsPath}`); // อัปเดต fileUrl เมื่อเปิด modal
    };

    const handleOk = (button: string) => {
        setLoading(true);
        setLoadingButton(button);
        setTimeout(() => {
            setLoading(false);
            setLoadingButton(null);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const tooltipStyle = { fontFamily: 'Kanit' };

    useEffect(() => {
        dispatch(docAsync(docsPath))
    }, [dispatch, docsPath])

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

                    <Button
                        key="submit"
                        type="primary"
                        loading={loadingButton === 'submit' && loading}
                        onClick={() => handleOk('submit')}
                    >
                        Public
                    </Button>,
                ]}
            >
                <StyledCard>
                    {fileUrl && (
                        <PDFServices
                            key={fileUrl} // ใช้ fileUrl เป็น key เพื่อบังคับให้ re-render
                            fileUrl={fileUrl}
                            approvers={approvers}
                            setApprovers={setApprovers}
                        />
                    )}
                </StyledCard>
            </Modal>
        </>
    );
};

export default PDFModal;

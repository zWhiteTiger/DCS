import { useEffect, useState } from 'react';
import { Button, Divider, Modal, Tooltip } from 'antd';
import { MdFileOpen } from 'react-icons/md';
import { Box, Card, Grid, styled } from '@mui/material';
import { useAppDispatch } from '../../../Store/Store';
import { docAsync, docSelector } from '../../../Store/Slices/DocSlice';
import { useSelector } from 'react-redux';
import PDFViewer from './Services/PDFViewer';

type PDFModalProps = {
    docsPath: string;  // Type for docsPath
};

const ApprovalModal = ({ docsPath }: PDFModalProps) => {

    const [open, setOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null); // ใช้ useState แทน useRef เพื่อควบคุมการเปลี่ยนแปลง

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal for confirmation
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Modal for rejection

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

    const handleCancel = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        setIsConfirmModalOpen(true); // Open the confirm modal
    };

    const handleReject = () => {
        setIsRejectModalOpen(true); // Open the reject modal
    };

    const handleConfirmOk = () => {
        // Add your confirm action here
        setIsConfirmModalOpen(false);
    };

    const handleRejectOk = () => {
        // Add your reject action here
        setIsRejectModalOpen(false);
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
                footer={[]}
            >

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <StyledCard>
                            {fileUrl && (
                                <PDFViewer
                                    fileUrl={fileUrl}
                                />
                            )}
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box className="my-2 p-5">
                            <Divider variant="dashed" dashed >การลงนาม</Divider>

                            <Box className="p-5 flex justify-between">
                                <Button
                                    size="large"
                                    style={{ background: "#3fcf38", color: "#FFFFFF", width: "125px" }}
                                    onClick={handleConfirm}
                                >
                                    ลงนาม
                                </Button>
                                <Button
                                    size="large"
                                    style={{ background: "#cf3b38", color: "#FFFFFF", width: "125px" }}
                                    onClick={handleReject}
                                >
                                    ปฏิเสธ
                                </Button>
                            </Box>

                            <Divider variant="dashed" dashed >รายชื่อผู้ลงนาม</Divider>
                        </Box>
                    </Grid>
                </Grid>
            </Modal>

            {/* Confirm Document Modal */}
            <Modal
                title="ยืนยันการลงนาม"
                open={isConfirmModalOpen}
                onOk={handleConfirmOk}
                onCancel={() => setIsConfirmModalOpen(false)}
                okText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <p>คุณแน่ใจว่าต้องการยืนยันการลงนามในเอกสารนี้หรือไม่?</p>
            </Modal>

            {/* Reject Document Modal */}
            <Modal
                title="ปฏิเสธเอกสาร"
                open={isRejectModalOpen}
                onOk={handleRejectOk}
                onCancel={() => setIsRejectModalOpen(false)}
                okText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <p>คุณแน่ใจว่าต้องการปฏิเสธเอกสารนี้หรือไม่?</p>
            </Modal>
        </>
    );
};

export default ApprovalModal;
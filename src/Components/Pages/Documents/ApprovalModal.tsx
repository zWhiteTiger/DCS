import { useEffect, useState } from 'react';
import { Button, Divider, Modal, Tooltip } from 'antd';
import { MdFileOpen } from 'react-icons/md';
import { Box, Card, Grid, styled, Typography } from '@mui/material';
import PDFViewer from './Services/PDFViewer';
import { httpClient } from '../Utility/HttpClient';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../Store/Slices/authSlice';

interface ApprovalCard {
    _id: string;
    email: string;
    isApproved: "unApproved" | "Approved" | "Reject"; // "unApproved" or "Approved"
    priority: number; // Assume priority is also part of the approval card
}

type PDFModalProps = {
    docsPath: string;
    docId: string;
};

const ApprovalModal = ({ docsPath, docId }: PDFModalProps) => {
    const [open, setOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [approvalCards, setApprovalCards] = useState<ApprovalCard[]>([]);
    const profileReducer = useSelector(authSelector);
    const [_maxPriority, setMaxPriority] = useState<number | null>(null);
    const [_currentPriority, setCurrentPriority] = useState<number>(0); // เพิ่ม currentPriority ที่ใช้จัดการค่า
    const approvedCount = approvalCards.filter((card: ApprovalCard) => card.isApproved === 'Approved').length;


    useEffect(() => {
        const fetchApprovalCards = async () => {
            try {
                const response = await httpClient.get(`/approval/${docId}`);
                if (response.status === 200) {
                    setApprovalCards(response.data);
                    const maxPrio = Math.max(...response.data.map((card: ApprovalCard) => card.priority));
                    setMaxPriority(maxPrio);

                    setCurrentPriority(response.data[0]?.currentPriority || 0);
                }
            } catch (error) {
                console.error('Error fetching approval cards:', error);
            }
        };
        fetchApprovalCards();
    }, [docId]);

    useEffect(() => {
        const userCards = approvalCards.filter((card: ApprovalCard) => card.email === profileReducer.result?.email);
        const hasUnapprovedCards = userCards.some((card: ApprovalCard) => card.isApproved === 'unApproved');
        const noUserCards = userCards.length === 0;
        const hasApprovedOrRejected = userCards.some((card: ApprovalCard) => card.isApproved === 'Approved' || card.isApproved === 'Reject');

        if (noUserCards || hasUnapprovedCards || hasApprovedOrRejected) {
        } else {
        }
    }, [approvalCards, profileReducer.result?.email]);

    const showModal = () => {
        setOpen(true);
        setFileUrl(`/pdf/${docsPath}`);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        setIsConfirmModalOpen(true);
    };

    const updateDocumentStatus = async (isApproved: string) => {
        try {
            const cardIdsToUpdate = approvalCards
                .filter((card: ApprovalCard) => card.email === profileReducer.result?.email)
                .map((card: ApprovalCard) => card._id);

            if (cardIdsToUpdate.length === 0) {
                console.warn('No approval cards found for the user:', profileReducer.result?.email);
                return;
            }

            // const index = approvalCards.findIndex((approve) => approve.id === action.payload.id);
            // if (index !== -1) {
            //     state.users[index] = action.payload;
            // }

            // Update the approval status
            const patchPromises = cardIdsToUpdate.map(async (id: string) => {
                const response = await httpClient.patch(`/approval/${id}`, {
                    isApproved: isApproved,
                });
                return response;
            });

            await Promise.all(patchPromises);

            // ดึงค่า currentPriority ปัจจุบันจากฐานข้อมูล
            const currentPriorityResponse = await httpClient.get(`/doc/${docsPath}`);
            const currentPriorityFromDb = currentPriorityResponse.data.currentPriority;

            // เพิ่มค่า currentPriority ขึ้น 1
            const updatedPriority = currentPriorityFromDb + 1;

            // อัปเดตค่า currentPriority ใหม่
            await httpClient.patch(`/doc/${docId}`, {
                currentPriority: updatedPriority,
            });

            // ตรวจสอบว่าผู้ใช้คนนี้เป็นคนสุดท้ายหรือไม่
            // const allApproved = approvalCards.every((card: ApprovalCard) => card.isApproved === 'Approved' || card.isApproved === 'Reject');
            const maxPriorityResponse = await httpClient.get(`/approval/${docId}`);
            const maxPriority = Math.max(...maxPriorityResponse.data.map((card: ApprovalCard) => card.priority));
            // ตรวจสอบว่าจำนวนผู้ลงนามที่ Approved เท่ากับค่าสูงสุดหรือไม่
            if (approvedCount >= maxPriority) {
                await httpClient.patch(`/doc/${docId}`, {
                    isProgress: 'complete',
                    isStatus: 'complete',
                    currentPriority: 0, // อัปเดตค่า currentPriority เป็น 0 เมื่อครบทุกคน
                });
            }

            console.log('Data updated successfully');
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleConfirmOk = () => {
        updateDocumentStatus('Approved');
        setIsConfirmModalOpen(false);
    };

    const handleReject = () => {
        setIsRejectModalOpen(true);
    };

    const handleRejectOk = () => {
        updateDocumentStatus('Reject');
        setIsRejectModalOpen(false);
    };

    const tooltipStyle = { fontFamily: 'Kanit' };

    const StyledCard = styled(Card)(() => ({
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
    }));

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
                    เปิดไฟล์
                </Button>
            </Tooltip>

            <Modal
                open={open}
                onCancel={handleCancel}
                width={1550}
                style={{ zIndex: 1, marginTop: '-70px', border: 'none', boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)' }}
                maskClosable={false}
                footer={[]}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <StyledCard>
                            {fileUrl && (
                                <PDFViewer
                                    fileUrl={fileUrl}
                                    docId={docId}
                                />
                            )}
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box className="my-2 p-5">
                            <Divider variant="dashed">การลงนาม</Divider>

                            <Card style={{
                                background: 'rgba(0, 0, 0, 0.5)',
                                border: '2px solid #000',
                                borderRadius: '7px',
                                padding: '16px',
                                color: '#FFF'
                            }}>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height="100%"
                                >
                                    <Typography>
                                        ลงนามแล้ว {approvalCards.filter(card => card.isApproved === 'Approved').length}/{approvalCards.length}
                                    </Typography>
                                </Box>
                            </Card>

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

                            <Divider variant="dashed">รายชื่อผู้ลงนาม</Divider>
                            <Box>
                                {approvalCards
                                    .sort((a, b) => a.priority - b.priority) // เรียงตามลำดับ priority
                                    .map((card, index) => (
                                        <Typography key={card._id} style={{ marginBottom: '8px' }}>
                                            {index + 1}. {card.email} - {card.isApproved === 'Approved' ? 'ลงนามแล้ว' : 'ยังไม่ลงนาม'}
                                        </Typography>
                                    ))}
                            </Box>
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
                okButtonProps={{ style: { backgroundColor: '#3fcf38', borderColor: '#088a01' } }}
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
                okButtonProps={{ style: { backgroundColor: '#cf3b38', borderColor: '#8a0000' } }}
            >
                <p>คุณแน่ใจว่าต้องการปฏิเสธเอกสารนี้หรือไม่?</p>
            </Modal>
        </>
    );
};

export default ApprovalModal;

import { useEffect, useState } from 'react';
import { Button, Divider, Modal, Tooltip } from 'antd';
import { MdFileOpen } from 'react-icons/md';
import { Box, Card, Grid, styled, Typography } from '@mui/material';
import PDFViewer from './Services/PDFViewer';
import { httpClient } from '../Utility/HttpClient';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../Store/Slices/authSlice';

// Define type for approval card
interface ApprovalCard {
    _id: string;
    email: string;
    isApprove: string;  // "unApproved" or "Approved"
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
    const [disableButtons, setDisableButtons] = useState(false);

    const profileReducer = useSelector(authSelector);

    // Fetch approval cards from the server
    useEffect(() => {
        const fetchApprovalCards = async () => {
            try {
                const response = await httpClient.get(`/approval/${docId}`);
                if (response.status === 200) {
                    setApprovalCards(response.data);
                }
            } catch (error) {
                console.error('Error fetching approval cards:', error);
            }
        };
        fetchApprovalCards();
    }, [docId]);

    // Check if buttons should be disabled
    // Check if buttons should be disabled
    useEffect(() => {
        const userCards = approvalCards.filter(card => card.email === profileReducer.result?.email);
        const hasUnapprovedCards = userCards.some(card => card.isApprove === 'unApprove');
        const noUserCards = userCards.length === 0;
        const hasApprovedOrRejected = userCards.some(card => card.isApprove === 'Approved' || card.isApprove === 'Reject');

        // Disable if the user has no cards or has unapproved/approved/rejected status
        if (noUserCards || hasUnapprovedCards || hasApprovedOrRejected) {
            setDisableButtons(true);
        } else {
            setDisableButtons(false);
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

    const handleConfirmOk = async () => {
        try {
            const cardIdsToUpdate = approvalCards
                .filter(card => card.email === profileReducer.result?.email)
                .map(card => card._id);

            if (cardIdsToUpdate.length === 0) {
                console.warn('No approval cards found for the user:', profileReducer.result?.email);
                return;
            }

            const patchPromises = cardIdsToUpdate.map(async id => {
                console.log(`Updating approval card ID: ${id}`);
                const response = await httpClient.patch(`/approval/${id}`, {
                    isApproved: 'Approved',
                });
                console.log('Patch response:', response);
                return response;
            });

            await Promise.all(patchPromises);

            setIsConfirmModalOpen(false);
            setDisableButtons(true); // Disable buttons after confirming
            console.log('Data updated successfully');
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleReject = () => {
        setIsRejectModalOpen(true);
    };

    const handleRejectOk = async () => {
        try {
            const cardIdsToUpdate = approvalCards
                .filter(card => card.email === profileReducer.result?.email)
                .map(card => card._id);

            if (cardIdsToUpdate.length === 0) {
                console.warn('No approval cards found for the user:', profileReducer.result?.email);
                return;
            }

            const patchPromises = cardIdsToUpdate.map(async id => {
                console.log(`Updating approval card ID: ${id}`);
                const response = await httpClient.patch(`/approval/${id}`, {
                    isApproved: 'Reject',
                });
                console.log('Patch response:', response);
                return response;
            });

            await Promise.all(patchPromises);

            setIsRejectModalOpen(false);
            setDisableButtons(true); // Disable buttons after rejecting
            console.log('Data updated successfully');
        } catch (error) {
            console.error('Error updating data:', error);
        }
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
                                        ลงนามแล้ว 0/1
                                    </Typography>
                                </Box>
                            </Card>

                            <Box className="p-5 flex justify-between">
                                <Button
                                    size="large"
                                    style={{ background: "#3fcf38", color: "#FFFFFF", width: "125px" }}
                                    onClick={handleConfirm}
                                    disabled={disableButtons}  // Disable based on conditions
                                >
                                    ลงนาม
                                </Button>
                                <Button
                                    size="large"
                                    style={{ background: "#cf3b38", color: "#FFFFFF", width: "125px" }}
                                    onClick={handleReject}
                                    disabled={disableButtons}  // Disable based on conditions
                                >
                                    ปฏิเสธ
                                </Button>
                            </Box>

                            <Divider variant="dashed">รายชื่อผู้ลงนาม</Divider>
                            <Typography>
                                ชื่อ-นามสกุล
                            </Typography>
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

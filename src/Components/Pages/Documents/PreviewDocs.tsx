import { useEffect, useState } from 'react';
import { Button, Divider, Modal, Tooltip } from 'antd';
import { MdFileOpen } from 'react-icons/md';
import { Box, Card, Grid, styled, Typography } from '@mui/material';
import PDFViewer from './Services/PDFViewer';
import { httpClient } from '../Utility/HttpClient';

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

const PreviewDocs = ({ docsPath, docId }: PDFModalProps) => {
    const [open, setOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [_approvalCards, setApprovalCards] = useState<ApprovalCard[]>([]);

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

    const showModal = () => {
        setOpen(true);
        setFileUrl(`/pdf/${docsPath}`);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const tooltipStyle = { fontFamily: 'Kanit' };

    const StyledCard = styled(Card)(() => ({
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
    }));

    return (
        <>
            <Tooltip title={<span style={tooltipStyle}>เรียกดูไฟล์</span>}>
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
                    เรียกดู
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
                            <Divider variant="dashed">รายชื่อผู้ลงนาม</Divider>
                            <Typography>
                                ชื่อ-นามสกุล
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Modal>
        </>
    );
};

export default PreviewDocs;

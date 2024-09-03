import React, { useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import { MdFileOpen } from 'react-icons/md';
import PDFServices from './Services/PDFServices';
import { Box, Card, CardContent, Grid, styled, Typography } from '@mui/material';

type PDFModalProps = {
    docsPath: string;  // Type for docsPath
};

const PDFModal = ({ docsPath }: PDFModalProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingButton, setLoadingButton] = useState<string | null>(null);
    const [approvers, setApprovers] = useState<string[]>([]);

    const FileURL = `/pdf/${docsPath}`;

    const StyledCard = styled(Card)(() => ({
        border: '1px solid #d5d5d5',
        width: '100%',
        boxSizing: 'border-box',
    }));

    const showModal = () => setOpen(true);

    const handleOk = (button: string) => {
        setLoading(true);
        setLoadingButton(button);
        setTimeout(() => {
            setLoading(false);
            setLoadingButton(null);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => setOpen(false);

    const tooltipStyle = { fontFamily: 'Kanit' };

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
                style={{ zIndex: 1, marginTop: '-70px' }}
                maskClosable={false}
                footer={[
                    <Button
                        key="back"
                        onClick={handleCancel}
                        loading={loadingButton === 'back' && loading}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        loading={loadingButton === 'save' && loading}
                        onClick={() => handleOk('save')}
                    >
                        Save
                    </Button>,
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
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <StyledCard>
                            <PDFServices fileUrl={FileURL} approvers={approvers} setApprovers={setApprovers} />
                        </StyledCard>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h5">เลือกบล๊อคคำสั่ง</Typography>
                        <Card
                            sx={{
                                border: '2px dashed #8000FF',
                                boxShadow: 'none',
                                textAlign: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <CardContent>
                                <Typography style={{ color: '#8000FF', fontWeight: 'bold', fontSize: '24px' }}>
                                    เพิ่มผู้ลงนาม
                                </Typography>
                                <Typography>
                                    ฟหดหฟกด
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Modal>
        </>
    );
};

export default PDFModal;

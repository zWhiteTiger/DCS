import { Card, CardContent, Grid } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Typography, Tooltip, Button } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoTrashBin } from "react-icons/io5";
import { MdFileOpen } from 'react-icons/md'
import Loader from '../../Loader/Loader'
import { authSelector } from '../../../../Store/Slices/authSlice'
import { useSelector } from 'react-redux'
import { httpClient } from '../../Utility/HttpClient'

type Props = {}

const fetchAPI = async () => {
    const response = await httpClient.get("doc");
    return response.data
}

const deleteDoc = async (id: string) => {
    const response = await httpClient.delete(`doc/${id}`);
    return response.data; // Adjust based on your API response
}

export interface Document {
    _id: string;
    doc_name: string;
    user_id: string;
    deleted_at: null;
    isStatus: string;
    docs_path: string;
    public: boolean;
    created_at: Date;
    updated_at: Date;
    __v: number;
}


export default function DraftList({ }: Props) {

    const profileReducer = useSelector(authSelector)

    const { data, isLoading, error } = useQuery<Document[], any>("docs", fetchAPI, {
        select: (data) => data.filter(doc => doc.user_id === profileReducer.result?._id),
    })

    const queryClient = useQueryClient();
    const { mutate , isLoading: isDeleting, error: deleteError } = useMutation(
        (id: string) => deleteDoc(id),
        {
            onSuccess: () => {
                // Invalidate and refetch the documents query to update the list
                queryClient.invalidateQueries("docs");
            },
            onError: (error) => {
                // Handle the error (e.g., show a notification)
                console.error('Error deleting document:', error);
            }
        }
    );

    if (error) {
        return <div>An error occurred</div>;
    }

    const tooltipStyle = {
        fontFamily: 'Kanit'
    };

    const cardStyles = {
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
    };

    return (
        <>
            {isLoading ? (
                <div className="mx-auto w-full flex justify-center items-center h-[80%]">
                    <Card style={{ marginBottom: '5px', backgroundColor: "#fafafa", ...cardStyles }}>
                        <Loader />
                    </Card>
                </div>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {data?.map((item: any, index: number) => {
                            let data = {
                                ...item,
                                status: 'unread'
                            };
                            let cardBackgroundColor;
                            switch (data.isStatus) {
                                case 'read':
                                    cardBackgroundColor = '#F1FBEF'; // Light green
                                    break;
                                case 'unread':
                                    cardBackgroundColor = '#EFF4FB'; // Light blue
                                    break;
                                case 'reject':
                                    cardBackgroundColor = '#FBF0EF'; // Light red
                                    break;
                                case 'draft':
                                    cardBackgroundColor = '#D2D2D2'; // Light red
                                    break;
                                case 'express':
                                    cardBackgroundColor = '#FFFAEF'; // Light red
                                    break;
                                default:
                                    cardBackgroundColor = 'inherit';
                            }

                            return (
                                <Card key={index} style={{ marginBottom: '5px', backgroundColor: cardBackgroundColor, ...cardStyles }}>
                                    <CardContent>
                                        <Grid container spacing={3} alignItems="start" style={{alignItems: 'center'}}>
                                            <Grid item xs={0}>
                                                <div style={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '20%' }}>
                                                    <img src='https://www.bing.com/th?id=OIP.zb2bMkSw2aP62F8liqmASQHaE8&w=202&h=200&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2' alt="User Avatar" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                </div>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography className="font-bold">
                                                    {data.doc_name}
                                                </Typography>
                                                <Typography style={tooltipStyle}>
                                                    {data.docs_path}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography className="font-bold">
                                                    {profileReducer.result?.firstName} {profileReducer.result?.lastName}
                                                </Typography>
                                                <Typography style={tooltipStyle}>
                                                    {profileReducer.result?.email}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography className="font-bold">
                                                    วันที่
                                                </Typography>
                                                <Typography style={tooltipStyle}>
                                                    {data.created_at}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography className="font-bold" style={{ marginBottom: '4px' }}>
                                                    สถานะ
                                                </Typography>
                                                <div style={{
                                                    backgroundColor:
                                                        data.isStatus === 'express' ? '#FFE6B6' : data.isStatus === 'draft' ? '#B6B6B6' : data.isStatus === 'read' ? '#AFFFEA' : data.isStatus === 'unread' ? '#CFC1FF' : data.isStatus === 'reject' ? '#FFC1C1' : '#6A50A7',
                                                    color: data.isStatus === 'express' ? '#DA9000' : data.isStatus === 'draft' ? '#FFFFFF' : data.isStatus === 'read' ? '#05CD99' : data.isStatus === 'unread' ? '#4318FF' : data.isStatus === 'reject' ? '#960000' : 'white',
                                                    padding: '1px 5px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {data.isStatus}
                                                </div>
                                            </Grid>
                                            <Grid item xs={1} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
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
                                                    >
                                                        แก้ไข
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={1} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                                <Tooltip title={<span style={tooltipStyle}>ลบไฟล์</span>}>
                                                    <Button
                                                        type="primary"
                                                        icon={<IoTrashBin />}
                                                        size="large"
                                                        style={{
                                                            fontFamily: 'Kanit',
                                                            color: 'white',
                                                            backgroundColor: '#FE3636',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        onClick={() => mutate(item._id)}
                                                    >
                                                        ลบไฟล์
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Grid>
                </Grid>
            )}
        </>
    )
}
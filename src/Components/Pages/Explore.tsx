import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { authSelector } from '../../Store/Slices/authSlice';
import SearchBarBlack from './Utility/SearchBar_Black';
import NoMoreContent from './Utility/NoMoreContent';
import { useQuery } from 'react-query';
import { useState } from 'react';
import Loader from './Loader/Loader';
import { httpClient } from './Utility/HttpClient';
import ApprovalModal from './Documents/ApprovalModal';

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

const fetchAPI = async () => {
  const response = await httpClient.get("doc"); // Fetch documents
  return response.data;
};

export default function Explore() {

  const profileReducer = useSelector(authSelector)
  const [imageSrc, _setImageSrc] = useState(profileReducer.result?.picture
    ? `${import.meta.env.VITE_URL}${profileReducer.result.picture}`
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');

  // Fetch and filter documents
  const { data, isLoading, error } = useQuery<Document[], any>("docs", fetchAPI, {
    select: (data) => data.filter(doc => doc.public === true), // Filter public documents
  });

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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ overflowX: 'auto', flex: '1' }}>
          <Grid container spacing={1}>
            {/* Left Section */}
            <Grid item xs={12} md={12}>
              <Card sx={cardStyles}>
                <CardContent>
                  <Grid container spacing={1}>
                    <Box className='m-5'>
                      <img src={imageSrc} alt="Profile" style={{ maxWidth: '200px', height: '200px', borderRadius: '10px', objectFit: 'cover' }} />
                    </Box>
                    <Box
                      className="infoBox mt-6"
                      display="flex"
                      flexDirection="column"
                    >
                      <Box className="my-5">
                        <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>{profileReducer.result?.firstName} {profileReducer.result?.lastName}</Typography>
                        <Typography>รหัสนักศึกษา: 12345678</Typography>
                      </Box>
                      <Box className="my-5">
                        <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>สาขาวิชา</Typography>
                        <Typography>วิศวกรรมคอมพิวเตอร์และระบบอัตโนมัติ (6441)</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box className="m-6" />
      <div style={{ overflowX: 'auto', display: 'flex' }}>
        <Grid container spacing={4}>
          {/* Full Width Section */}
          <Grid item xs={12}>
            <Card sx={cardStyles}>
              <CardContent>
                <Box className="mb-5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>Documents</Typography>
                  <Box sx={{ ml: 3 }}>
                    <SearchBarBlack />
                  </Box>
                </Box>

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
                            cardBackgroundColor = '#F3F3F3'; // Light red
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
                              <Grid container spacing={3} alignItems="start" style={{ alignItems: 'center' }}>
                                <Grid item xs={0}>
                                  <div style={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '20%' }}>
                                    <img src={imageSrc} alt="User Avatar" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
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
                                  <Typography style={{
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
                                  </Typography>
                                </Grid>
                                <Grid item xs={2} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                  <ApprovalModal docsPath={data?.docs_path} />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Grid>
                  </Grid>
                )}

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <NoMoreContent />

    </>
  );
}

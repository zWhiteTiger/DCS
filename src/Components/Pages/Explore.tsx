import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { authSelector } from '../../Store/Slices/authSlice';
import NoMoreContent from './Utility/NoMoreContent';
import { useQuery } from 'react-query';
import { useState } from 'react';
import Loader from './Loader/Loader';
import { httpClient } from './Utility/HttpClient';
import ApprovalModal from './Documents/ApprovalModal';

export interface Document {
  _id: string;
  doc_name: string;
  currentPriority: number;
  isStatus: string;
  docs_path: string;
  public: boolean;
  isProgress: string;
  created_at: Date;
  updated_at: Date;
  user_id: string; // Add this line to reference the user ID
  approval: Approval[];
}

export interface Approval {
  priority: number;
  email: string;
  firstName: string;
  lastName: string;
}

// Fetch both documents and approvalsz
const fetchAPI = async () => {
  const docsResponse = await httpClient.get("doc");
  const approvalResponse = await httpClient.get("approval");

  return {
    docs: docsResponse.data,
    approvals: approvalResponse.data,
  };
};

export default function Explore() {
  const profileReducer = useSelector(authSelector);
  const userEmail: string | undefined = profileReducer.result?.email;

  const [imageSrc, _setImageSrc] = useState(profileReducer.result?.picture
    ? `${import.meta.env.VITE_URL}${profileReducer.result.picture}`
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');

  // Function to check if the current user should sign
  const canUserSign = (doc: Document, approvals: Approval[], userEmail: string | undefined) => {
    const currentPriority = doc.currentPriority;
    const approvalEntry = approvals.find(approval => approval.priority === currentPriority);
    return approvalEntry && approvalEntry.email === userEmail;
  };

  // Fetch documents and approvals
  const { data, isLoading, error } = useQuery<{ docs: Document[], approvals: Approval[] }, any>(
    "docsAndApprovals",
    fetchAPI,
    {
      select: (data) => ({
        docs: data.docs
          .filter(doc => canUserSign(doc, data.approvals, userEmail) || doc.user_id === profileReducer.result?._id) // Include documents created by the user
          .filter(doc => doc.public && doc.isStatus !== "draft" && doc.isProgress === "pending"), // Show public documents that are not drafts
        approvals: data.approvals
      })
    }
  );

  // Check for error
  if (error) {
    return <div>An error occurred</div>;
  }

  // Department mapping
  const departmentNames: Record<string, string> = {
    CE: "วิศวกรรมคอมพิวเตอร์",
    LE: "วิศวกรรมโลจิสติกส์และเทคโนโลยีขนส่ง",
    IEA: "วิศวกรรมอุตสาหการ",
    ME: "วิศวกรรมเครื่องกล",
    IDA: "นวัตกรรมการออกแบบและสถาปัตยกรรม",
    AME: "วิศวกรรมเครื่องจักรกลเกษตร"
  };

  const tooltipStyle = { fontFamily: 'Kanit' };
  const cardStyles = {
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)'
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ overflowX: 'auto', flex: '1' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Card sx={cardStyles}>
                <CardContent>
                  <Grid container spacing={1}>
                    <Box className='m-5'>
                      <img src={imageSrc} alt="Profile" style={{ maxWidth: '200px', height: '200px', borderRadius: '10px', objectFit: 'cover' }} />
                    </Box>
                    <Box className="infoBox mt-6" display="flex" flexDirection="column">
                      <Box className="my-5">
                        <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>
                          {profileReducer.result?.firstName} {profileReducer.result?.lastName}
                        </Typography>
                        <Typography>{profileReducer.result?.email}</Typography>
                      </Box>
                      <Box className="my-5">
                        <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>สาขาวิชา</Typography>
                        <Typography>
                          {profileReducer.result?.department
                            ? departmentNames[profileReducer.result?.department] || "ไม่มีสาขาวิชา"
                            : "ไม่มีสาขาวิชา"}
                        </Typography>
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
          <Grid item xs={12}>
            <Card sx={cardStyles}>
              <CardContent>
                <Box className="mb-5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>Documents</Typography>
                  <Box sx={{ ml: 3 }}>Search</Box>
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
                      {data?.docs?.map((doc: Document, index: number) => {
                        
                        let cardBackgroundColor;
                        switch (doc.isStatus) {
                          case 'standard':
                            cardBackgroundColor = '#EFF4FB';
                            break;
                          case 'reject':
                            cardBackgroundColor = '#FBF0EF';
                            break;
                          case 'draft':
                            cardBackgroundColor = '#F3F3F3';
                            break;
                          case 'express':
                            cardBackgroundColor = '#FFFAEF';
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
                                  <Typography className="font-bold">{doc.doc_name}</Typography>
                                  <Typography style={tooltipStyle}>{doc.docs_path}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography className="font-bold">{profileReducer.result?.firstName} {profileReducer.result?.lastName}</Typography>
                                  <Typography style={tooltipStyle}>{profileReducer.result?.email}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography className="font-bold">วันที่</Typography>
                                  <Typography style={tooltipStyle}>{doc.created_at.toString()}</Typography>
                                </Grid>
                                <Grid item xs={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <Typography className="font-bold" style={{ marginBottom: '4px' }}>สถานะ</Typography>
                                  {doc.user_id === profileReducer.result?._id ? (
                                    <Typography style={{
                                      backgroundColor:
                                        doc.isStatus === 'express' ? '#FFE6B6' : doc.isStatus === 'draft' ? '#B6B6B6' : doc.isStatus === 'standard' ? '#CFC1FF' : doc.isStatus === 'reject' ? '#FFC1C1' : '#6A50A7',
                                      color:
                                        doc.isStatus === 'express' ? '#DA9000' : doc.isStatus === 'draft' ? '#FFFFFF' : doc.isStatus === 'standard' ? '#4318FF' : doc.isStatus === 'reject' ? '#960000' : 'white',
                                      padding: '1px 5px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      <Box className="flex justify-center" flexDirection="column" style={{ alignItems: 'center' }}>
                                        <Typography>
                                          ลงนามแล้ว
                                        </Typography>
                                        <Typography>
                                          0/1
                                        </Typography>
                                      </Box>
                                    </Typography>
                                  ) : (
                                    <Typography style={{
                                      backgroundColor:
                                        doc.isStatus === 'express' ? '#FFE6B6' : doc.isStatus === 'draft' ? '#B6B6B6' : doc.isStatus === 'standard' ? '#CFC1FF' : doc.isStatus === 'reject' ? '#FFC1C1' : '#6A50A7',
                                      color:
                                        doc.isStatus === 'express' ? '#DA9000' : doc.isStatus === 'draft' ? '#FFFFFF' : doc.isStatus === 'standard' ? '#4318FF' : doc.isStatus === 'reject' ? '#960000' : 'white',
                                      padding: '1px 5px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      {doc.isStatus}
                                    </Typography>
                                  )}
                                </Grid>
                                <Grid item xs={2} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                  <ApprovalModal docsPath={doc.docs_path} docId={doc._id} />
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

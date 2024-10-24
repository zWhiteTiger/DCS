import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { httpClient } from '../Utility/HttpClient';
import { authSelector } from '../../../Store/Slices/authSlice';
import NoMoreContent from '../Utility/NoMoreContent';
import Loader from '../Loader/Loader';
import Static from '../../Static/Static';
import PreviewDocs from '../Documents/PreviewDocs';
import PDFExporter from '../Documents/Services/PDFExporter';

export interface Document {
  _id: string;
  doc_name: string;
  user_id: string;
  deleted_at: null;
  isStatus: string;
  isProgress: string;
  docs_path: string;
  public: boolean;
  created_at: Date;
  updated_at: Date;
  __v: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string; // Assuming you have a picture field
}

// Fetch documents that are public and complete
const fetchDocuments = async () => {
  const response = await httpClient.get("doc");
  return response.data.filter((doc: Document) => doc.public === true && doc.isProgress === 'complete'); // Filter for public and complete documents
};

export default function Archive() {
  const profileReducer = useSelector(authSelector);
  const [imageSrc, _setImageSrc] = useState(profileReducer.result?.picture
    ? `${import.meta.env.VITE_URL}${profileReducer.result.picture}`
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');

  // Fetch documents
  const { data: documents, isLoading, error } = useQuery<Document[], any>("docs", fetchDocuments);

  if (error) {
    return <div>An error occurred</div>;
  }

  const tooltipStyle = {
    fontFamily: 'Kanit'
  };

  const cardStyles = {
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ overflowX: 'auto', flex: '1' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Static />
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
                  <Box sx={{ ml: 3 }}>
                    Search
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
                      {documents?.map((document: Document) => {
                        // Fetch user data for the document's user_id
                        let cardBackgroundColor;
                        switch (document.isStatus) {
                          case 'standard':
                            cardBackgroundColor = '#EFF4FB'; // Light blue
                            break;
                          case 'reject':
                            cardBackgroundColor = '#EFF4FB'; // Light red
                            break;
                          case 'draft':
                            cardBackgroundColor = '#EFF4FB'; // Light red
                            break;
                          case 'express':
                            cardBackgroundColor = '#EFF4FB'; // Light red
                            break;
                          default:
                            cardBackgroundColor = '#EFF4FB';
                        }

                        return (
                          <Card key={document._id} style={{ marginBottom: '5px', backgroundColor: cardBackgroundColor, ...cardStyles }}>
                            <CardContent>
                              <Grid container spacing={3} alignItems="start" style={{ alignItems: 'center' }}>
                                <Grid item xs={0}>
                                  <div style={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '20%' }}>
                                    <img src={imageSrc} alt="User Avatar" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                  </div>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography className="font-bold">
                                    {document.doc_name}
                                  </Typography>
                                  <Typography style={tooltipStyle}>
                                    {document.docs_path}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography className="font-bold">
                                    name
                                  </Typography>
                                  <Typography style={tooltipStyle}>
                                    email
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography className="font-bold">
                                    วันที่
                                  </Typography>
                                  <Typography style={tooltipStyle}>
                                    {new Date(document.created_at).toLocaleDateString()} {/* Format date to string */}
                                  </Typography>
                                </Grid>
                                <Grid item xs={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <Typography className="font-bold" style={{ marginBottom: '4px' }}>
                                    สถานะ
                                  </Typography>
                                  <Typography className="mt-1" style={{
                                    backgroundColor: '#AFFFEA',
                                    color: '#05CD99',
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    {document.isProgress}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                  <PreviewDocs docId={document._id} docsPath={document?.docs_path} />
                                  <PDFExporter docId={document._id} docsPath={document?.docs_path} />

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

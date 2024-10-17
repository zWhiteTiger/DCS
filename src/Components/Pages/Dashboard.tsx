import { Box, Grid, Typography, Card, CardContent, createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { useSelector } from 'react-redux';
import { authSelector } from '../../Store/Slices/authSlice';
import Static from '../Static/Static';
import Shortcuts from './Utility/Shortcuts';
import Graph from '../Static/GraphStatic';
import { useEffect, useState } from 'react';
import NameQuery from './Loader/NameQuery';
import NoMoreContent from './Utility/NoMoreContent';
import IDQuery from './Loader/IDQuery';
import ApprovalModal from './Documents/ApprovalModal';
import { httpClient } from './Utility/HttpClient';
import { useQuery } from 'react-query';
import Loader from './Loader/Loader';
import axios from 'axios';

type Props = {};

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

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  role?: string;
  department?: string;
};

const fetchAPI = async () => {
  const response = await httpClient.get("doc"); // Fetch documents
  return response.data;
};

// Define a custom theme with Mitr font
const theme = createTheme({
  typography: {
    fontFamily: [
      "Kanit", "sans-serif",
    ].join(','),
  },
});

// Define styles for cards
const cardStyles = {
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
};

const userinfo = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
};

const shortcutsx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  textAlign: 'start',
};

export default function Dashboard({ }: Props) {

  const isMobile = useMediaQuery('(max-width:960px)');
  const profileReducer = useSelector(authSelector);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [_users, setUsers] = useState<User[]>([]);

  // Fetch and filter documents
  const { data, isLoading, error } = useQuery<Document[], any>("docs", fetchAPI, {
    select: (data) => data.filter(doc => doc.public === true && doc.isStatus === "express" && doc.isProgress == "pending"), // Filter public documents with express status
  });

  if (error) {
    return <div>An error occurred</div>;
  }
  const [loading, setLoading] = useState(true); // State to manage loading
  const [_name, setName] = useState<string | null>(null); // State to manage name

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_URL}/user/`)
      .then((response) => {
        console.log(response.data); // ตรวจสอบข้อมูล
        setUsers(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    // Simulate a name query with delay
    const fetchName = async () => {
      // Simulate an API call to fetch the name
      const fetchedName = await new Promise<string>((resolve) =>
        setTimeout(() => resolve(profileReducer?.result?.firstName || 'Default Name'), 1000) // Simulate fetching name in 1 second
      );

      setTimeout(() => {
        setName(fetchedName);
        setLoading(false);
      }, 1000); // 3-second delay before showing the name
    };

    fetchName();
  }, [profileReducer]);

  const picturePath = profileReducer.result?.picture;
  const imageSrc = picturePath
    ? `${import.meta.env.VITE_URL}${picturePath}`
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  const tooltipStyle = {
    fontFamily: 'Kanit'
  };

  const roleName: Record<string, string> = {
    student: "นักศึกษา",
    counselor: "ที่ปรึกษาสโมสรนักศึกษา",
    head_of_student_affairs: "หัวหน้าฝ่ายกิจการนักศึกษา",
    vice_dean: "รองคณบดี",
    dean: "คณบดี",
    admin: "ผู้ดูแลระบบ",
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <Static />

        <Grid className="mt-2" container spacing={3}>
          {!isMobile && ( // Render only if not in mobile mode
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={cardStyles}>
                <CardContent>
                  <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>
                    ทางลัด
                  </Typography>
                  <Grid item xs={12} sm={12} md={12}>
                    <Card sx={cardStyles}>
                      <CardContent sx={shortcutsx}>

                        <Shortcuts />

                      </CardContent>
                    </Card>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyles}>
              <CardContent>
                <Box style={{ fontFamily: 'Kanit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>
                      สถิติ
                    </Typography>
                  </Box>
                  <Box style={{ display: 'flex', alignItems: 'center', color: percentageChange !== null && percentageChange >= 0 ? '#05CD99' : '#FF0000' }}>
                    {percentageChange !== null && percentageChange >= 0 ? (
                      <BiSolidUpArrow style={{ color: '#05CD99', marginRight: '0.5rem' }} />
                    ) : (
                      <BiSolidDownArrow style={{ color: '#FF0000', marginRight: '0.5rem' }} />
                    )}
                    <Typography variant="body1" className="text-lm">
                      {percentageChange !== null ? `${percentageChange.toFixed(2)}%` : 'No data'}
                    </Typography>
                  </Box>
                </Box>
                {/* Pass the setter to Graph to calculate and update the percentageChange */}
                <Graph setPercentageChange={setPercentageChange} />
              </CardContent>
            </Card>

          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={userinfo}>
              <CardContent className="m-3">
                <Box style={{ width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '100%' }}>
                  <img src={imageSrc} alt="Profile" style={{ maxWidth: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box className="mt-5">
                  <Typography variant="h6" gutterBottom>
                    {loading ? (
                      <NameQuery /> // Show loading component
                    ) : (
                      `${profileReducer.result?.firstName} ${profileReducer.result?.lastName}`
                    )}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {loading ? (
                      <IDQuery /> // Show loading component
                    ) : (
                      `${profileReducer.result?.email}`
                    )}
                  </Typography>
                  <br />
                  <Typography variant="h6">
                    ตำแหน่ง
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {loading ? (
                      <IDQuery /> // Show loading component
                    ) : (
                      `${profileReducer.result?.role
                        ? roleName[profileReducer.result?.role] || "ว่าง"
                        : "ว่าง"
                      }`
                    )}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box className="m-6" />
        <Box>
          <Box style={{ overflowX: 'auto', display: 'flex' }}>
            <Grid container spacing={3}>
              {/* Left Section */}
              <Grid item xs={12} md={12}>
                <Card sx={cardStyles} className='mb-5'>
                  <CardContent>
                    <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold mb-5'>รายการเอกสาร</Typography>

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
                                      <ApprovalModal docId={data._id} docsPath={data.docs_path} />
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
          </Box>

        </Box>
        <NoMoreContent />
      </>
    </ThemeProvider>
  );
}

import { Box, Grid, Typography, Card, CardContent, createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { BiSolidUpArrow } from "react-icons/bi";

import { LuHardDriveDownload } from "react-icons/lu";
import { Button } from 'antd';
import useSelection from 'antd/es/table/hooks/useSelection';
import { useSelector } from 'react-redux';
import { authSelector } from '../../Store/Slices/authSlice';
import Static from '../Static/Static';
import Shortcuts from './Utility/Shortcuts';
import Graph from '../Static/GraphStatic';

type Props = {};

const bookData = [
  { idBook: 'AEA-000110-STD', title: 'หนังสือ1', date: '18/4/2567' },
  { idBook: 'AEA-000111-STD', title: 'หนังสือ2', date: '17/4/2567' },
  { idBook: 'AEA-000112-STD', title: 'หนังสือ3', date: '16/4/2567' },
  { idBook: 'AEA-000113-STD', title: 'หนังสือ4', date: '15/4/2567' },
  { idBook: 'AEA-000114-STD', title: 'หนังสือ5', date: '14/4/2567' },
];

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

const ListcardStyles = {
  borderRadius: '10px',
  backgroundColor: '#EFF4FB',
  boxShadow: '0px 0px 10px rgba(255,255,255,0.8)', // Drop shadow with color #EFF4FB
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

  const profileReducer = useSelector(authSelector)

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

                        <img src='http://localhost:4444/pdf/image.png' alt="User Avatar" style={{ maxWidth: '100%', height: 'auto' }} />


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
                  <div>
                    <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>
                      สถิติ
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#05CD99' }}>
                    <BiSolidUpArrow style={{ color: '#05CD99', marginRight: '0.5rem' }} />
                    <Typography variant="body1" className="text-lm">
                      +100.00%
                    </Typography>
                  </div>
                </Box>
                <Graph />
              </CardContent>
            </Card>

          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={userinfo}>
              <CardContent className="m-3">
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '100%' }}>
                  <img src='https://www.bing.com/th?id=OIP.zb2bMkSw2aP62F8liqmASQHaE8&w=202&h=200&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2' alt="User Avatar" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <Box className="mt-5">
                  <Typography variant="h6" gutterBottom>
                    {profileReducer.result?.firstName} {profileReducer.result?.lastName}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    รหัสนักศึกษา: 123456
                  </Typography>
                  <br />
                  <Typography variant="h6">
                    ตำแหน่ง
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    นักศึกษา
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box className="m-6" />
        <div>
          <div style={{ overflowX: 'auto', display: 'flex' }}>
            <Grid container spacing={3}>
              {/* Left Section */}
              <Grid item xs={12} md={8}>
                <Card sx={cardStyles} className='mb-5'>
                  <CardContent>
                    <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>รายการเอกสาร</Typography>

                    {bookData.map((book, index) => (
                      <Card key={index} className='mt-3' sx={{ ...ListcardStyles, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Button className='m-3'
                          icon={<LuHardDriveDownload />}
                          size='large'
                          style={{ fontFamily: 'Kanit', color: 'white', backgroundColor: '#4318FF' }}
                        >.PDF</Button>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography sx={{ marginLeft: '5px' }}>{book.idBook}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography sx={{ marginLeft: '5px' }}>{book.title}</Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography sx={{ marginRight: '25px' }}>{book.date}</Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Section */}
              <Grid item xs={12} md={4}>
                <Card sx={cardStyles}>
                  <CardContent>
                    <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>Time lines</Typography>
                    <Typography>This is the content of the right card.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>

        </div>
      </>
    </ThemeProvider>
  );
}

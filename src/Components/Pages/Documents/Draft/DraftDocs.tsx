import { Box, Grid, Typography, Card, CardContent, Divider } from '@mui/material';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { LuSearch } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../../Store/Slices/authSlice';
import SearchBarBlack from '../../Utility/SearchBar_Black';
import NoMoreContent from '../../Utility/NoMoreContent';
import DraftList from './DraftList';

const cardStyles = {
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
};


export default function DraftDocs() {

  const profileReducer = useSelector(authSelector)

  const picturePath = profileReducer.result?.picture;
  const imageSrc = picturePath
    ? `http://localhost:4444${picturePath}`
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ overflowX: 'auto', flex: '1' }}>
          <Grid container spacing={1}>
            {/* Left Section */}
            <Grid item xs={12} md={8}>
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
            <Grid item xs={12} md={4}>
              <Card sx={cardStyles}>
                <CardContent>
                  <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>History</Typography>
                  <Box className="my-2" style={{ display: 'flex', alignItems: 'center' }}>
                    <LuSearch style={{
                      background: '#E0E5F2',
                      color: '#7551FF',
                      padding: '5px',
                      borderRadius: '4px',
                      fontSize: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '8px' // เพิ่ม margin ขวาเพื่อให้มีระยะห่างระหว่างไอคอนกับข้อความ
                    }} />
                    <Typography>หนังสือ1</Typography>
                    <FaCheck className='mx-2' style={{
                      fontSize: '20px',
                      color: 'green',
                    }} />
                  </Box>
                  <Box className="my-2" style={{ display: 'flex', alignItems: 'center' }}>
                    <LuSearch style={{
                      background: '#E0E5F2',
                      color: '#7551FF',
                      padding: '5px',
                      borderRadius: '4px',
                      fontSize: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '8px' // เพิ่ม margin ขวาเพื่อให้มีระยะห่างระหว่างไอคอนกับข้อความ
                    }} />
                    <Typography>หนังสือ2</Typography>
                    <FaXmark className='mx-2' style={{
                      fontSize: '20px',
                      color: 'red',
                    }} />
                  </Box>
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>Documents</Typography>
                  <Box sx={{ ml: 3 }}>
                    <SearchBarBlack />
                  </Box>
                </Box>

                <Divider className="mb-5" style={{ borderColor: '#dedede', color: '#dedede', padding: '20px' }} ></Divider>

                <DraftList />

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <NoMoreContent />

    </>
  );
}

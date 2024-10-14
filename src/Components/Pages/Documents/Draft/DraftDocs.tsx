import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../../Store/Slices/authSlice';
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
    ? `${import.meta.env.VITE_URL}${picturePath}`
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  const departmentNames: Record<string, string> = {
    CE: "วิศวกรรมคอมพิวเตอร์",
    LE: "วิศวกรรมโลจิสติกส์และเทคโนโลยีขนส่ง",
    IEA: "วิศวกรรมอุตสาหการ",
    ME: "วิศวกรรมเครื่องกล",
    IDA: "นวัตกรรมการออกแบบและสถาปัตยกรรม",
    AME: "วิศวกรรมเครื่องจักรกลเกษตร"
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
          {/* Full Width Section */}
          <Grid item xs={12}>
            <Card sx={cardStyles}>
              <CardContent>
                <Box className="mb-2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography style={{ color: '#1B2559' }} className='text-xl font-bold'>เอกสาร</Typography>
                  <Box sx={{ ml: 3 }}>
                    Search
                  </Box>
                </Box>
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

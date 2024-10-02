import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';
import { authSelector, setIsLogout } from '../../Store/Slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '../../Store/Store';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const profileReducer = useSelector(authSelector);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useAppDispatch()

  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {

      dispatch(setIsLogout())

      await axios.post(`${import.meta.env.VITE_URL}/auth/logout`, {}, {
        withCredentials: true,
      });
      navigate('/auth/login'); // Redirect to login page or home after logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally handle errors (e.g., show a notification)
    }
  };

  const picturePath = profileReducer.result?.picture;
  const imageSrc = picturePath
    ? `${import.meta.env.VITE_URL}${picturePath}`
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="จัดการบัญชี">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 0 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <div style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '100%' }}>
              <img src={imageSrc} alt="Profile" style={{ maxWidth: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              borderRadius: 20,
              bgcolor: '#FFF',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box className='m-3'>
          <MenuItem onClick={handleClose}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className='mr-5' style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '100%' }}>
                <img src={imageSrc} alt="User Avatar" style={{ maxWidth: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <Typography style={{ display: 'flex', color: '#1B2559' }}>
                  {profileReducer.result?.firstName} {profileReducer.result?.lastName}
                </Typography>
                <Typography variant='body2' style={{ color: '#A3AED0' }}>
                  {profileReducer.result?.email}
                </Typography>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleProfileNavigation(); handleClose(); }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Typography style={{ display: 'flex', color: '#1B2559' }}>
                  บัญชี
                </Typography>
                <Typography variant='body2' style={{ color: '#A3AED0' }}>
                  จัดการบัญชีของคุณ
                </Typography>
              </div>
            </div>
          </MenuItem>
          <MenuItem onClick={() => { handleLogout(); handleClose(); }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Typography style={{ display: 'flex', color: '#1B2559' }}>
                  ลงชื่อออก
                </Typography>
                <Typography variant='body2' style={{ color: '#A3AED0' }}>
                  ออกจากระบบในอุปกรณ์นี้
                </Typography>
              </div>
            </div>
          </MenuItem>
        </Box>
      </Menu>
    </React.Fragment>
  );
}

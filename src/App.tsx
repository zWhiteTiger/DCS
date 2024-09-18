import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, createTheme, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';

// Import your components here
import Appbar from './Components/Sidebar/Appbar';
import Sidebar from './Components/Sidebar/Sidebar';
// import { useSelector } from 'react-redux';
// import { authSelector } from './Store/Slices/authSlice';
import { useProfile } from './Hooks/useProfile';
import PrivateRoute from './Utility/PrivateRoute';
import DraftDocs from './Components/Pages/Documents/Draft/DraftDocs';
import CreateDocs from './Components/Pages/Documents/CreateDocs';
import PublicRoute from './Utility/PublicRoute';
import Register from './Components/Pages/Auth/Register';
import Login from './Components/Pages/Auth/Login';
import ERR404 from './Components/Pages/Errors/ERR404';
import OverviewDocs from './Components/Pages/Documents/Overviews';
import Archive from './Components/Pages/Archive/Archive';
import Explore from './Components/Pages/Explore';
import Dashboard from './Components/Pages/Dashboard';
// import { useAppDispatch } from './Store/Store';
import { pdfjs } from 'react-pdf';
import Profile from './Components/Pages/Setting/Profile';
import { useSelector } from 'react-redux';
import { authSelector } from './Store/Slices/authSlice';
import { useAppDispatch } from './Store/Store';
import axios from 'axios';
import { httpClient } from './Components/Pages/Utility/HttpClient';
<<<<<<< HEAD
import UserManagement from './Components/Pages/Setting/UserManagement';
=======
import ForgotPassword from './Components/Pages/Auth/Forgot_Pass';
>>>>>>> e089e037d1d42e4468a90c039df7bfd67b7829d6

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const drawerWidth = 240;

const containerStyle = {
  backgroundColor: '#F4F7FE',
  backgroundSize: 'cover',
  backdrop: 'blur(5px)',
  backgroundRepeat: 'no-repeat',
  height: '100vh',
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
  overflowY: 'auto',
};

const sxStyle = {
  ...containerStyle,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backdropFilter: 'blur(0px)',
  },
};

const theme = createTheme({
  typography: {
    fontFamily: [
      "Kanit", "sans-serif",
    ].join(','),
  },
});

const App = () => {
  const [_pageTitle, setPageTitle] = useState('');
  const location = useLocation();
  const [_isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  // const _authReducer = useSelector(authSelector)
  // const _dispatch = useAppDispatch()
  // const { } = useProfile()

  const refresToken = async () => {
    try {
      const response = await axios.post('http://localhost:4444/auth/refresh/token', {}, { withCredentials: true })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    refresToken()
  }, [])

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 1024);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  useEffect(() => {
    const path = location.pathname;
    let title = 'Document Controller System'; // Title default value
    if (path === '/') {
      title = 'DCS • ดาร์ชบอร์ด';
    } else if (path === '/explore') {
      title = 'DCS • สำรวจ';
    } else if (path === '/archive') {
      title = 'DCS • คลังเอกสาร';
    } else if (path === '/docs/create') {
      title = 'DCS • สร้างเอกสาร';
    } else if (path === '/docs/overviews') {
      title = 'DCS • ภาพรวม';
    } else if (path === '/docs/draft') {
      title = 'DCS • ร่างเอกสาร';
    } else if (path === '/auth/login') {
      title = 'DCS • เข้าสู่ระบบ';
    } else if (path === '/auth/register') {
      title = 'DCS • สร้างบัญชีผู้ใช้';
    } else if (path === '/profile') {
      title = 'Authentication • Register';
    } else if (path === '/u/manager') {
      title = 'DCS • จัดการบัญชีผู้ใช้งาน';
    } else {
      title = '404 • ไม่พบหน้านี้';
    }
    document.title = title; // Update document title
    setPageTitle(title); // Update state for page title
  }, [location]); // Run whenever location changes

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  if (/^\/auth\//.test(location.pathname)) {
    // console.log(location.pathname);
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={sxStyle}>
        <CssBaseline />

<<<<<<< HEAD
        {['/', '/explore', '/profile', '/setting', '/archive', '/docs/create', '/u/manager', '/docs/draft',].includes(location.pathname) && (
=======
        {['/', '/explore', '/profile', '/setting', '/archive', '/docs/create', '/docs/overviews', '/auth/forgetpassword', '/docs/draft',].includes(location.pathname) && (
>>>>>>> e089e037d1d42e4468a90c039df7bfd67b7829d6
          <>
            <Appbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
            <Sidebar
              drawerWidth={drawerWidth}
              mobileOpen={mobileOpen}
              handleDrawerTransitionEnd={handleDrawerTransitionEnd}
              handleDrawerClose={handleDrawerClose}
            />
          </>
        )}
        <Box
          component="main"
          sx={{
            padding: (/^\/auth\//.test(location.pathname)) ? 0 : 3,
            flexGrow: 1,
            mt: 0,
            width: {
              sm: `calc(100% - ${drawerWidth}px)`,
              xs: '100%', // Adjust the width for smaller screens
            },
          }}
        >
          {(/^\/auth\//.test(location.pathname)) ? undefined : <Toolbar />}

          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/explore' element={<Explore />} />
              <Route path='/archive' element={<Archive />} />
              <Route path='/docs/create' element={<CreateDocs />} />
              <Route path='/docs/draft' element={<DraftDocs />} />
              <Route path='/setting' element={<DraftDocs />} />
              <Route path='/profile' element={<Profile />} />
            </Route>
            {/* Auth */}
            <Route element={<PublicRoute />}>
              <Route path='/auth/register' element={<Register />} />
              <Route path='/auth/login' element={<Login />} />
              <Route path='/auth/forgetpassword' element={<ForgotPassword />} />
            </Route>
            {/* Error Report */}
            <Route path='*' element={<ERR404 />} />
            <Route path='u/manager' element={<UserManagement />} />
          </Routes >
        </Box>
      </Box>
    </ThemeProvider >
  );
};

export default App;

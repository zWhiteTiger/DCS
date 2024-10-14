import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, createTheme, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';

// Import your components here
import Appbar from './Components/Sidebar/Appbar';
import Sidebar from './Components/Sidebar/Sidebar';
import PrivateRoute from './Utility/PrivateRoute';
import DraftDocs from './Components/Pages/Documents/Draft/DraftDocs';
import CreateDocs from './Components/Pages/Documents/CreateDocs';
import PublicRoute from './Utility/PublicRoute';
import Register from './Components/Pages/Auth/Register';
import Login from './Components/Pages/Auth/Login';
import ERR404 from './Components/Pages/Errors/ERR404';
import Archive from './Components/Pages/Archive/Archive';
import Explore from './Components/Pages/Explore';
import Dashboard from './Components/Pages/Dashboard';
import { pdfjs } from 'react-pdf';
import Profile from './Components/Pages/Setting/Profile';
import axios from 'axios';
import ForgotPassword from './Components/Pages/Auth/Forgot_Pass';
import UserManagement from './Components/Pages/Setting/UserManagement';

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
  const [_isMobile, _setIsMobile] = useState(window.innerWidth <= 1024);

  const refresToken = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/auth/refresh/token`, {}, { withCredentials: true })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    refresToken()
  }, [])

  useEffect(() => {
    const path = location.pathname;
    let title = `${import.meta.env.VITE_SERVICES_NAME}`; // Title default value
    if (path === '/') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • ดาร์ชบอร์ด`;
    } else if (path === '/explore') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • สำรวจ`;
    } else if (path === '/archive') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • คลังเอกสาร`;
    } else if (path === '/docs/create') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • สร้างเอกสาร`;
    } else if (path === '/user/management') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • จัดการผู้ใช้งาน`;
    } else if (path === '/docs/draft') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • ร่างเอกสาร`;
    } else if (path === '/auth/login') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • เข้าสู่ระบบ`;
    } else if (path === '/auth/register') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • สร้างบัญชีผู้ใช้`;
    } else if (path === '/profile') {
      title = `${import.meta.env.VITE_SERVICES_NAME} • โปรไฟล์`;
    } else {
      title = `404 • ไม่พบหน้านี้`;
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

        {['/', '/explore', '/profile', '/setting', '/archive', '/docs/create', '/user/management', '/auth/forgetpassword', '/docs/draft',].includes(location.pathname) && (
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
              sm: 'calc(100% - ${drawerWidth}px)',
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
              <Route path='/user/management' element={<UserManagement />} />
            </Route>
            {/* Auth */}

            <Route element={<PublicRoute />}>
              <Route path='/auth/register' element={<Register />} />
              <Route path='/auth/login' element={<Login />} />
              <Route path='/auth/forgetpassword' element={<ForgotPassword />} />
            </Route>
            {/* Error Report */}
            <Route path='*' element={<ERR404 />} />
          </Routes >
        </Box>
      </Box>
    </ThemeProvider >
  );
};

export default App;
import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography, useMediaQuery } from '@mui/material';
import { LuMenu } from "react-icons/lu";
import AccountMenu from './AccountMenu';
import SearchBar from '../Pages/Utility/SearchBar';
import { useLocation } from 'react-router-dom';

type Props = {
    drawerWidth: number
    handleDrawerToggle: () => void
}

const Appbar: React.FC<Props> = ({ drawerWidth, handleDrawerToggle }) => {
    // const userImagePath = '/path/to/user/image.jpg';

    const isMobile = useMediaQuery('(max-width:1024px)');

    const location = useLocation()

    const pageNames: Record<string, string> = {
        '/': 'หน้าหลัก',
        '/explore': 'สำรวจเอกสาร',
        '/profile': 'บัญชี',
        '/archive': 'คลังเอกสาร',
        '/docs/create': 'สร้างเอกสาร',
        '/docs/overviews': 'ภาพรวมเอกสาร',
        '/docs/draft': 'แบบร่างเอกสาร',
        '/u/manager': 'จัดการผู้ใช้งาน'
    };

    // Get the current page name based on the path
    const pageName = pageNames[location.pathname] || 'Page';

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { xl: `calc(100% - ${drawerWidth}px)` },
                ml: { xl: `${drawerWidth}px` },
                zIndex: 1,
                backgroundColor: 'rgba(0, 18, 52, 0)',
                boxShadow: 'none', // Remove drop shadow
                display: 'flex',
                position: 'absolute',
            }}
        >

            <Toolbar className='flex justify-between'>

                {!isMobile && ( // Render only if not in mobile mode
                    <Box>
                        <Typography style={{ color: '#0e3d96', fontSize: '28px', fontWeight: 'bold' }}>
                            Document Control System Software
                        </Typography>
                        <Typography style={{ color: '#2a5dbd', fontSize: '20px' }}>
                            โปรแกรมควบคุมเอกสารสโมสรนักศึกษา - {pageName}
                        </Typography>
                    </Box>
                )}
                <Box>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { xl: 'none' } }}
                    >
                        <LuMenu style={{ color: 'black' }} />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 3 }}>
                        <SearchBar />
                    </Box>
                    {/* Profile section */}
                    <AccountMenu />
                    {/* Add space between profile and search bar */}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Appbar;

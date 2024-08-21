import React from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { LuMenu } from "react-icons/lu";
import AccountMenu from './AccountMenu';
import SearchBar from '../Pages/Utility/SearchBar';

type Props = {
    drawerWidth: number
    handleDrawerToggle: () => void
}

const Appbar: React.FC<Props> = ({ drawerWidth, handleDrawerToggle }) => {
    // const userImagePath = '/path/to/user/image.jpg';

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { xl: `calc(100% - ${drawerWidth}px)` },
                ml: { xl: `${drawerWidth}px` },
                backgroundColor: 'rgba(0, 18, 52, 0)',
                boxShadow: 'none', // Remove drop shadow
                display: 'flex',
                position: 'absolute',
            }}
        >
            <Toolbar className='flex justify-between'>
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
                    <AccountMenu/>
                    {/* Add space between profile and search bar */}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Appbar;

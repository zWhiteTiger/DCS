import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Collapse } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { BiSolidDashboard } from 'react-icons/bi';
import { PiCompassFill, PiListMagnifyingGlass, PiListMagnifyingGlassFill } from 'react-icons/pi';
import { LuCompass, LuLayoutDashboard, LuArchive } from 'react-icons/lu';
import { HiDocumentText, HiOutlineDocumentText, HiDocumentPlus, HiOutlineDocumentPlus } from 'react-icons/hi2';
import { HiArchive } from 'react-icons/hi';
import logo from '/logo/logo.png';
import { MyNavLink } from '../Pages/Utility/NavLink';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';


type Props = {
  drawerWidth: number;
  window?: () => Window;
  mobileOpen: boolean;
  handleDrawerTransitionEnd: () => void;
  handleDrawerClose: () => void;
};

export default function Sidebar({
  window,
  drawerWidth,
  mobileOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd,
}: Props) {
  const container = window !== undefined ? () => window().document.body : undefined;
  const location = useLocation();
  const [openDocs, setOpenDocs] = useState(false);

  const handleDocsClick = () => {
    setOpenDocs(!openDocs);
  };

  const sxStyle = {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    fontFamily: 'Kanit, sans-serif',
  };

  const mainMenuItems = [
    {
      path: '/',
      icon1: <BiSolidDashboard size={'1.5em'} className='text-isActive' />, // is active
      icon2: <LuLayoutDashboard size={'1.5em'} className='text-IconColor' />, // none active
      title: 'ดาร์ชบอร์ด',
    },
    {
      path: '/explore',
      icon1: <PiCompassFill size={'1.5em'} className='text-isActive' />, // is active
      icon2: <LuCompass size={'1.5em'} className='text-IconColor' />, // none active
      title: 'สำรวจ',
    },
    {
      path: '/archive',
      icon1: <HiArchive size={'1.5em'} className='text-isActive' />, // is active
      icon2: <LuArchive size={'1.5em'} className='text-IconColor' />, // none active
      title: 'คลังเอกสาร',
    },
  ];

  const docsMenuItems = [
    {
      path: '/docs/overviews',
      icon1: <PiListMagnifyingGlassFill size={'1.5em'} className='text-isActive' />, // is active
      icon2: <PiListMagnifyingGlass size={'1.5em'} className='text-IconColor' />, // none active
      title: 'ภาพรวม',
    },
    {
      path: '/docs/create',
      icon1: <HiDocumentPlus size={'1.5em'} className='text-isActive' />, // is active
      icon2: <HiOutlineDocumentPlus size={'1.5em'} className='text-IconColor' />, // none active
      title: 'สร้าง',
    },
    {
      path: '/docs/draft',
      icon1: <HiDocumentText size={'1.5em'} className='text-isActive' />, // is active
      icon2: <HiOutlineDocumentText size={'1.5em'} className='text-IconColor' />, // none active
      title: 'แบบร่าง',
    },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <img
          src={logo}
          alt="Logo"
        />
      </Toolbar>
      <Box className="m-5" sx={sxStyle} />
      <List>
        {mainMenuItems.map((item) => (
          <Box key={item.path}>
            <ListItem
              disablePadding
              to={item.path}
              component={MyNavLink}
              activeClassName="Mui-selected"
              exact
            >
              <ListItemButton>
                <ListItemIcon>
                  {location.pathname === item.path ? item.icon1 : item.icon2}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    color: location.pathname === item.path ? '#FFF' : '#A3AED0',
                  }}
                />
              </ListItemButton>
            </ListItem>
            <Box className="m-2" />
          </Box>
        ))}
        <ListItemButton onClick={handleDocsClick}>
          <ListItemIcon>
            <HiOutlineDocumentText
              size={'1.5em'}
              className={openDocs ? 'text-blue' : 'text-IconColor'}
              style={{ color: openDocs ? 'blue' : undefined }}
            />
          </ListItemIcon>
          <ListItemText
            primary="เอกสาร"
            sx={{
              color: openDocs ? 'blue' : '#A3AED0',
            }}
          />
          {openDocs ? <ExpandLess style={{ color: 'blue' }} /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDocs} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {docsMenuItems.map((item) => (
              <Box key={item.path}>
                <ListItem
                  disablePadding
                  to={item.path}
                  component={MyNavLink}
                  activeClassName="Mui-selected"
                  exact
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      {location.pathname === item.path ? item.icon1 : item.icon2}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        color: location.pathname === item.path ? '#FFF' : '#A3AED0',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Box className="m-2" />
              </Box>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { xl: drawerWidth },
        flexShrink: { sm: 0 },
      }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', xl: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            boxShadow: 'none',
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', xl: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            boxShadow: 'none',
            border: 'none',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
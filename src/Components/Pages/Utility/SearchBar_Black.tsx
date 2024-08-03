import { useRef } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { SearchIcon } from 'lucide-react';

export default function SearchBarBlack() {
  const searchRef = useRef(null);

  return (
    <Paper
      component="form"
      ref={searchRef}
      sx={{
        p: '1px 1px',
        display: 'flex',
        borderRadius: 3,
        alignItems: 'center',
        width: '100%', // Set the width to 100% by default
        backgroundColor: '#EFF4FB',
        color: '#8F9BBA',
        boxShadow: 'none',
      }}
    >
      <IconButton
        sx={{ p: '10px' }}
        aria-label="search"
        style={{ fontSize: 'small' }}
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
      />
    </Paper>
  );
}

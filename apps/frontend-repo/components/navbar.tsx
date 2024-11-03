'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { cookieManager } from '../utils/cookies';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/action';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const isUnAuth = pathname.includes('sign-in') || pathname.includes('sign-up');

  if (isUnAuth) return;

  const handleLogout = async () => {
    cookieManager.clearAuthCookies();
    dispatch(userActions.logout());
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Button color='inherit'>Home</Button>
          </Link>
          <Link href='/edit-profile' style={{ textDecoration: 'none' }}>
            <Button color='inherit'>Edit Profile</Button>
          </Link>
        </Box>
        <Link href='/sign-in' onClick={handleLogout}>
          <Button color='inherit'>Logout</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

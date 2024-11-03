'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import { RootState } from '../store/store';
import { cookieManager } from '../utils/cookies';
import { COOKIE_KEYS } from '../utils/cookies';
import UserService from '../apis/user';
import { userActions } from '../store/action';

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, errorMessage, isError, user } = useSelector((state: RootState) => state.user);

  const handleFetchUser = async () => {
    try {
      const userData = await UserService.getUserData(
        cookieManager.getCookie(COOKIE_KEYS.USER_ID) || '',
      );
      dispatch(userActions.setUser(userData));
    } catch (error) {
      dispatch(
        userActions.setError(error instanceof Error ? error.message : 'An unknown error occurred'),
      );
    }
  };

  return (
    <Card sx={{ min: 400, margin: 'auto', mt: 4 }}>
      <CardHeader title='User Information' />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 2,
            }}
          >
            <Button
              variant='contained'
              onClick={handleFetchUser}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color='inherit' /> : null}
            >
              {loading ? 'Fetching...' : 'Fetch User Info'}
            </Button>
            <Button variant='outlined' size='small' onClick={() => router.push('/edit-profile')}>
              Edit
            </Button>
          </Box>

          {loading && (
            <Typography variant='body1' color='primary'>
              Loading user information...
            </Typography>
          )}

          {isError && (
            <Typography variant='body1' color='error'>
              Error: {errorMessage}
            </Typography>
          )}

          {user && (
            <Box sx={{ width: '100%' }}>
              <Typography variant='h6' color='success.main' gutterBottom>
                User Information Retrieved Successfully
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary='ID' secondary={user.id} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Email' secondary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Display Name' secondary={user.displayName || 'N/A'} />
                </ListItem>
              </List>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

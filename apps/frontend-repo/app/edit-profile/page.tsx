'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';

import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Container,
  Box,
  Alert,
  Backdrop,
  CircularProgress,
  AlertTitle,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateUserData } from '@my-turbo-labs/shared';

import { userActions } from '../../store/action';
import { RootState } from '../../store/store';
import UserService from '../../apis/user';
import { COOKIE_KEYS } from '../../utils/cookies';
import { cookieManager } from '../../utils/cookies';

const editUserSchema = z.object({
  displayName: z.string().nullable().optional(),
});

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const { user, loading, errorMessage, successMessage, isError, isSuccess } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    const handleFetchUser = async () => {
      try {
        const userData = await UserService.getUserData(
          cookieManager.getCookie(COOKIE_KEYS.USER_ID) || '',
        );

        dispatch(userActions.setUser(userData));
      } catch (error) {
        dispatch(
          userActions.setError(
            error instanceof Error ? error.message : 'An unknown error occurred',
          ),
        );
      }
    };

    handleFetchUser();
  }, [user?.id]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(editUserSchema),
    values: {
      displayName: user?.displayName || '',
    },
  });

  const onSubmit = async (data: UpdateUserData) => {
    if (!user) return;

    dispatch(userActions.setLoading(true));
    try {
      const res = await UserService.updateUserData(user.id, data);
      dispatch(userActions.setSuccess('Profile updated successfully!'));

      dispatch(userActions.setUser(res));
    } catch (error) {
      dispatch(
        userActions.setError(
          error instanceof Error ? error.message : 'An error occurred while updating profile',
        ),
      );
    } finally {
      dispatch(userActions.setLoading(false));
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card>
          <CardHeader
            title='Edit Profile'
            subheader='Update your profile information'
            titleTypographyProps={{ align: 'center' }}
            subheaderTypographyProps={{ align: 'center' }}
          />
          <CardContent>
            {(isError || isSuccess) && (
              <Alert severity={isError ? 'error' : 'success'} sx={{ mb: 2 }}>
                <AlertTitle>{isError ? 'Error' : 'Success'}</AlertTitle>
                {errorMessage || successMessage}
              </Alert>
            )}
            <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
              <Controller
                name='displayName'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin='normal'
                    fullWidth
                    id='displayName'
                    label='Display Name'
                    autoFocus
                    variant='filled'
                    error={!!errors.displayName}
                    helperText={errors.displayName?.message}
                  />
                )}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

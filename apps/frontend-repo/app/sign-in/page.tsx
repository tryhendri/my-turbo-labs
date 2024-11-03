'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Container,
  Box,
  Link,
  Alert,
  AlertTitle,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserData } from '@my-turbo-labs/shared';

import { userActions } from '../../store/action';
import { RootState } from '../../store/store';
import { cookieManager } from '../../utils/cookies';
import { auth } from '../../config/firebase';

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, errorMessage, successMessage, isError, isSuccess } = useSelector(
    (state: RootState) => state.user,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: CreateUserData) => {
    dispatch(userActions.setLoading(true));
    try {
      const res = await signInWithEmailAndPassword(auth, data.email, data.password);

      dispatch(userActions.setSuccess('Sign in successful!'));

      const {
        user: {
          uid,
          refreshToken,
          displayName,
          email,
          // @ts-ignore
          accessToken,
        },
        // @ts-ignore
        _tokenResponse: { expiresIn },
      } = res;

      cookieManager.setAuthCookies(accessToken, refreshToken, uid, expiresIn);

      dispatch(
        userActions.setUser({
          id: uid,
          displayName: displayName || '',
          email: email as string,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      router.push('/');
    } catch (error) {
      dispatch(
        userActions.setError(
          error instanceof Error ? error.message : 'An error occurred during sign in',
        ),
      );
    } finally {
      dispatch(userActions.setLoading(false));
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
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
            title='Sign In'
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
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    variant='filled'
                    label='Email Address'
                    autoComplete='email'
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin='normal'
                    required
                    fullWidth
                    id='password'
                    label='Password'
                    type='password'
                    variant='filled'
                    error={!!errors.password}
                    helperText={errors.password?.message}
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Typography variant='body2' color='text.secondary' align='center'>
                Don't have an account?{' '}
                <Link href='/sign-up' variant='body2'>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

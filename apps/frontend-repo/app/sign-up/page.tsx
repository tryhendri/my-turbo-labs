'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as z from 'zod';

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
  Backdrop,
  CircularProgress,
  AlertTitle,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserData, GetUserData } from '@my-turbo-labs/shared';

import { setDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { userActions } from '../../store/action';
import { RootState } from '../../store/store';
import { auth, db } from '../../config/firebase';

const signupSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SignUpPage() {
  const dispatch = useDispatch();
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
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: CreateUserData) => {
    dispatch(userActions.setLoading(true));
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        id: userCredential.user.uid,
        displayName: userCredential.user.displayName,
        email: data.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
      } as GetUserData);

      dispatch(userActions.setSuccess('Sign up successful! Please check your email.'));
    } catch (error) {
      dispatch(
        userActions.setError(
          error instanceof Error ? error.message : 'An error occurred during sign up',
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
            title='Sign Up'
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
              <Controller
                name='confirmPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin='normal'
                    required
                    fullWidth
                    variant='filled'
                    id='confirmPassword'
                    label='Confirm Password'
                    type='password'
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
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
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
              <Typography variant='body2' color='text.secondary' align='center'>
                Already have an account?{' '}
                <Link href='/sign-in' variant='body2'>
                  Log in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

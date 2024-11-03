'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { userActions } from '../store/action';

export const useResetReduxState = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    // Reset error state when route changes
    dispatch(userActions.clearMessages());
  }, [pathname, dispatch]);
};

export default function ResetReduxProvider({ children }: { children: React.ReactNode }) {
  useResetReduxState();
  return children;
}

'use client';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useGetVendorInfoQuery } from '../../_api/query';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { Box, LoadingOverlay } from '@mantine/core';

// Define the context type
interface PrivilegeContextType {
  accessLevel: string;
  updateAccess: (path: string) => void;
  checkAccess: (path: string) => boolean;
  lockElements: (path: string) => { disabled: boolean };
}

// Create the context
const PrivilegeContext = createContext<PrivilegeContextType | undefined>(
  undefined,
);

// Create the context provider component
const PrivilegeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();

  const requestInfo = useGetVendorInfoQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const validRoutes = ['basic', 'detail', 'ppda', 'payment', 'doc', 'review'];

  const [accessLevel, setAccessLevel] = useState<string>('basic');

  useEffect(() => {
    if (requestInfo.isSuccess && requestInfo.data) {
      setAccessLevel(requestInfo.data.level);
      if (requestInfo.data.level === 'Completed') {
        router.push('/vendor/registration/track-applications');
      } else if (requestInfo.data.level === 'Submit') {
        router.push('/vendor/registration/track-applications');
      } else if (validRoutes.includes(requestInfo.data.level)) {
        router.push(`/vendor/registration/new/${requestInfo.data.level}`);
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestInfo.isSuccess, requestInfo.data]);

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification(
        'Error on fetching vendor information',
      );
      router.prefetch('/vendor/dashboard');
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestInfo.isError]);

  // Use useMemo to memoize the context value
  const contextValue = useMemo(() => {
    return {
      accessLevel,
      checkAccess: (path: string) => path === accessLevel,
      lockElements: (path: string) => ({ disabled: !(path === accessLevel) }),
      updateAccess: (path: string) => setAccessLevel(path),
    };
  }, [accessLevel]);

  return (
    <PrivilegeContext.Provider value={contextValue}>
      {requestInfo.isLoading ? (
        <Box pos="relative" className="w-full h-full">
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
        </Box>
      ) : (
        children
      )}
    </PrivilegeContext.Provider>
  );
};
// Custom hook to access the API URL
const usePrivilege = () => {
  const config = useContext(PrivilegeContext);
  if (config === undefined) {
    throw new Error('usePrivilege must be used within a ConfigProvider');
  }
  return config;
};

export { usePrivilege, PrivilegeContextProvider };

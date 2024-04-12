'use client';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { VendorLevel, VendorStatus } from '@/models/vendorRegistration';

type AccessRules = {
  [status in VendorStatus]: {
    active: boolean;
    readWriteLevels: VendorLevel[];
    readOnlyLevels: VendorLevel[];
  };
};
interface PrivilegeContextType {
  accessLevel: string;
  accessStatus: string;
  updateAccess: (level: string) => void;
  updateStatus: (level: string) => void;
  checkAccess: (level: VendorLevel, status?: string) => boolean;
  lockElements: (level: VendorLevel, status?: string) => { disabled: boolean };
  nextRoute: VendorLevel | null;
  prevRoute: VendorLevel | null;
  navigateToNextRoute: () => void;
  navigateToPrevRoute: () => void;
  hasReadAccess: (level: VendorLevel) => boolean;
  hasReadWriteAccess: (level: VendorLevel) => boolean;
}

export function elementHasAccess(level: VendorLevel, status: VendorStatus) {
  if (status in accessRules && accessRules[status].active) {
    const { readWriteLevels, readOnlyLevels } = accessRules[status];

    if (readWriteLevels.includes(level)) {
      return { disabled: false };
    } else if (readOnlyLevels.includes(level)) {
      return { disabled: true };
    } else {
      return { disabled: true };
    }
  } else {
    return { disabled: true };
  }
}
export function hasAccess(level: VendorLevel, status: VendorStatus): boolean {
  if (status in accessRules && accessRules[status].active) {
    const { readWriteLevels, readOnlyLevels } = accessRules[status];
    if (readWriteLevels.includes(level)) {
      return readWriteLevels.includes(level);
    } else if (readOnlyLevels.includes(level)) {
      return false;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// Example usage:
const accessRules: AccessRules = {
  new: {
    active: true,
    readWriteLevels: ['basic'],
    readOnlyLevels: [],
  },
  Draft: {
    active: true,
    readWriteLevels: [
      'detail',
      'doc',
      'info',
      'payment',
      'ppda',
      'preferential',
      'review',
    ],
    readOnlyLevels: ['basic'],
  },
  Save: {
    active: true,
    readWriteLevels: [
      'detail',
      'doc',
      'info',
      'payment',
      'ppda',
      'preferential',
      'review',
    ],
    readOnlyLevels: ['basic'],
  },
  Active: {
    active: true,
    readWriteLevels: [
      'detail',
      'doc',
      'info',
      'payment',
      'ppda',
      'preferential',
      'review',
    ],
    readOnlyLevels: ['basic'],
  },
  Approved: {
    active: true,
    readWriteLevels: [],
    readOnlyLevels: [],
  },
  Adjustment: {
    active: true,
    readWriteLevels: ['detail', 'doc', 'info', 'payment', 'review'],
    readOnlyLevels: ['basic', 'ppda', 'preferential'],
  },
  Submitted: {
    active: true,
    readWriteLevels: [],
    readOnlyLevels: [
      'basic',
      'detail',
      'doc',
      'info',
      'payment',
      'preferential',
      'ppda',
      'review',
    ],
  },
  Rejected: {
    active: true,
    readWriteLevels: [],
    readOnlyLevels: [],
  },
};

const PrivilegeContext = createContext<PrivilegeContextType | undefined>(
  undefined,
);
interface PrivilegeContextProviderProps {
  data: any;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

export const validRoutes: VendorLevel[] = [
  'basic',
  'detail',
  'ppda',
  'payment',
  'preferential',
  'doc',
  'review',
];
const PrivilegeContextProvider: React.FC<
  PropsWithChildren<PrivilegeContextProviderProps>
> = ({ children, ...props }) => {
  const router = useRouter();
  const path = usePathname();

  const { data, isSuccess } = props;

  const [accessLevel, setAccessLevel] = useState<VendorLevel>('basic');
  const [accessStatus, setAccessStatus] = useState<VendorStatus>('new');

  useEffect(() => {
    if (isSuccess && data?.status) {
      setAccessStatus(data?.status as VendorStatus);
    }
    return () => {};
  }, [isSuccess, data]);

  const [currentIndex, setCurrentIndex] = useState<number>(
    validRoutes.indexOf(path.split('/')[4] as VendorLevel),
  );

  useEffect(() => {
    setCurrentIndex(validRoutes.indexOf(path.split('/')[4] as VendorLevel));
  }, [path]);

  const nextRoutePath =
    currentIndex < validRoutes.length - 1
      ? validRoutes[currentIndex + 1]
      : null;
  const prevRoutePath = currentIndex > 0 ? validRoutes[currentIndex - 1] : null;

  const navigateToNextRoute = () => {
    nextRoutePath &&
      router.push(`/my-workspace/registration/new/${nextRoutePath}`);
  };

  const navigateToPrevRoute = (params?: string) => {
    prevRoutePath &&
      router.push(`/my-workspace/registration/new/${prevRoutePath}`);
  };
  // console.log(accessLevel, accessStatus);
  // Use useMemo to memoize the context value
  const contextValue = useMemo(() => {
    return {
      accessLevel,
      accessStatus,
      checkAccess: (level, status) => hasAccess(level, status ?? accessStatus),
      lockElements: (level, status) =>
        elementHasAccess(level, status ?? accessStatus),
      updateAccess: (level) => setAccessLevel(level),
      updateStatus: (status) => setAccessStatus(status),
      nextRoute: nextRoutePath,
      prevRoute: prevRoutePath,
      navigateToNextRoute,
      navigateToPrevRoute,
      hasReadAccess: (level) => hasAccess(level, accessStatus),
      hasReadWriteAccess: (level) =>
        elementHasAccess(level, accessStatus).disabled,
    };
  }, [accessLevel]);

  return (
    <PrivilegeContext.Provider value={contextValue}>
      {children}
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

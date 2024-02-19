'use client';

import { useRouter } from 'next/router';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useAddFormMutation,
  useLazyGetFPPADataQuery,
  useLazyGetMBRSDataQuery,
  useLazyGetMRADataQuery,
  useLazyGetNCICDataQuery,
} from '../../../_api/query';
import { NotificationService } from '../../../../../_components/notification';

const VendorFormContext = createContext<{
  state: {
    mra: any;
    mbrs: any;
    fppa: any;
    ncic: any;
  };
  fetchVendorData: (tin: string, issuedDate: string) => void;
}>({
  state: { mra: null, mbrs: null, fppa: null, ncic: null },
  fetchVendorData: (tin, issuedDate) => {},
});

export function VendorFormProvider({ children }) {
  const [state, setState] = useState<{
    mra: any;
    mbrs: any;
    fppa: any;
    ncic: any;
  }>({
    mra: null,
    mbrs: null,
    fppa: null,
    ncic: null,
  });
  const [getMRA, getMRADataValues] = useLazyGetMRADataQuery({});
  const [getMBRS, getMBRSDataValues] = useLazyGetMBRSDataQuery({});
  const [getFPPA, getFPPADataValues] = useLazyGetFPPADataQuery({});
  const [getNCIC, getNCICDataValues] = useLazyGetNCICDataQuery({});

  const fetchVendorData = async (tin: string, issuedDate: string) => {
    await getMRA({
      tin: tin,
      issuedDate,
    });
    await getMBRS({
      tin: tin,
    });
    await getFPPA({
      tin: tin,
    });
    await getNCIC({
      tin: tin,
    });
  };

  // Effect to update the state based on RTK Query
  useEffect(() => {
    if (getMRADataValues.data) {
      setState((prevState) => ({ ...prevState, mra: getMRADataValues.data }));
    }
    if (getMBRSDataValues.data) {
      setState((prevState) => ({ ...prevState, mbrs: getMBRSDataValues.data }));
    }
    if (getFPPADataValues.data) {
      setState((prevState) => ({ ...prevState, fppa: getFPPADataValues.data }));
    }
    if (getNCICDataValues.data) {
      setState((prevState) => ({ ...prevState, ncic: getNCICDataValues.data }));
    }
  }, [
    getMRADataValues.data,
    getMBRSDataValues.data,
    getFPPADataValues.data,
    getNCICDataValues.data,
  ]);

  useEffect(() => {
    if (getMRADataValues.isSuccess && getMRADataValues.data == null) {
      NotificationService.requestErrorNotification('Invalid Request');
    }
    if (getMRADataValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [
    getMRADataValues.data,
    getMRADataValues.isError,
    getMRADataValues.isSuccess,
  ]);

  const memoizedState = useMemo(() => state, [state]);

  return (
    <VendorFormContext.Provider
      value={{ state: memoizedState, fetchVendorData }}
    >
      {children}
    </VendorFormContext.Provider>
  );
}

export function useVendorForm() {
  const context = useContext(VendorFormContext);
  if (!context) {
    throw new Error('useVendorForm must be used within a VendorFormProvider');
  }
  return context;
}

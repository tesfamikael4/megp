import { Button } from '@mantine/core';
import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
export const newRequestFormData = {
  basic: {
    name: 'Acme Corporation',
    businessType: 'Sole Proprietorship',
    origin: 'New York',
    district: 'Manhattan',
    country: 'MW',
    tinNumber: '98765432',
  },
};
export const vendorInformationData = {
  businessSizeAndOwnership: {
    registeredCapital: {
      amount: '1000000',
      currency: 'KW',
    },
    paidUpCapital: {
      amount: '1000000',
      currency: 'KW',
    },
    numberOfEmployees: '100000',
    ownershipType: 'Malawian',
  },
  address: {
    postalAddress: '123 Main Street',
    primaryEmail: 'contact@acmecorp.com',
    alternateEmail: 'info@acmecorp.com',
    mobilePhone: '1234567890',
    telephone: '9876543210',
    fax: '123456',
    website: 'http://acmecorp.com',
  },
  contactPersons: [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobileNumber: '1234567890',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      mobileNumber: '9876543210',
    },
    {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      mobileNumber: '5555555555',
    },
  ],
  shareHolders: [
    {
      id: 'c63d5dfd-fe2a-4653-8478-6ee3c350a8f3',
      firstName: 'John',
      lastName: 'Doe',
      vendorId: '4f32b0ef-2012-4b65-85ce-3e457d649e40',
      nationality: 'US',
      share: '100',
    },
    {
      id: 'cb60a775-f12c-46d4-865a-826449ac1db3',
      firstName: 'Jane',
      lastName: 'Smith',
      vendorId: '4f32b0ef-2012-4b65-85ce-3e457d649e40',
      nationality: 'US',
      share: '50',
    },
  ],
  beneficialOwnership: [
    {
      id: '9b27ec0e-0474-4314-aab4-d8d787891071',
      firstName: 'Weyni',
      lastName: 'Yirefu',
      vendorId: '4f32b0ef-2012-4b65-85ce-3e457d649e40',
      nationality: 'US',
    },
  ],
  bankAccountDetails: [
    {
      accountHolderFullName: 'Acme Corporation',
      accountNumber: '1234567890',
      bankBranchAddress: '123 Bank Street',
      currency: 'USD',
      bankSWIFT_BICCode: 'SWIFT123',
      iBAN: 'US1234567890',
      status: 'Active',
      bankId: 'e716e6ca-a117-4c3d-9ae7-38c6ca52d27b',
      bankName: 'First National Bank',
      hashValue: 'hash123',
      branchName: 'Main Branch',
    },
  ],
  areasOfBusinessInterest: [
    {
      category: 'goods',
      lineOfBusiness: [
        {
          id: '148c3b66-e213-9d98-923a-2bec4dffeb2b',
          name: 'Telecommunications equipment',
        },
        {
          id: '10a9f8a0-8974-43d1-af3d-608afbeb5527',
          name: 'Textile products',
        },
        {
          id: 'e3e14750-65f0-c53b-b4ab-7369513607ca',
          name: 'QV6VBYDYO7',
        },
        {
          id: '641a3198-42ab-f65a-a8df-7005f7f4cb46',
          name: 'Office equipment',
        },
      ],
      priceRange: 'aa4da85e-39fb-42c1-8808-2a06767f3ae9',
    },
  ],
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: 'Certificate123',
    mRA_TPINCertificate: 'TPIN456',
    generalReceipt_BankDepositSlip: 'Receipt789',
    mRATaxClearanceCertificate: 'TaxClearance123',
    previousPPDARegistrationCertificate: 'PPDA456',
    mSMECertificate: 'SME789',
  },
};
export const AutoFillButton: React.FC<{
  data: any;
  setValues: UseFormSetValue<any>;
}> = ({ data, setValues }) => {
  const flattenFormData = (data: any, prefix = '') => {
    const flattened: any = {};
    for (const key in data) {
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        const nestedValues = flattenFormData(data[key], `${prefix}${key}.`);
        Object.assign(flattened, nestedValues);
      } else {
        flattened[`${prefix}${key}`] = data[key];
      }
    }
    return flattened;
  };

  const flattenedData = flattenFormData(data);

  return (
    <Button
      onClick={() => {
        for (const key in flattenedData) {
          setValues(key as any, flattenedData[key]);
        }
      }}
    >
      Auto fill
    </Button>
  );
};

import { BusinessSizeAndOwnership } from './businessSizeAndOwnership';
import { AddressInformation } from './addressInformation';
import { BankAccountDetails } from './bankAccountDetails';
import { ShareHolders } from './shareHolders';
import { BeneficialOwnership } from './beneficialOwnership';
import { BasicInfo } from './basicInfo';
import { ContactPersons } from './contactPersons';
import {
  bankAccountSchema,
  beneficialOwnershipShareholderSchema,
  contactPersonSchema,
  shareHoldersSchema,
} from './schema';

interface Tabs {
  tabValue: string;
  tabName: string;
  tabDescription: string;
  tabPanelComponent: React.ReactNode;
}
export const useTabs = (extendedRegister, control, disabled): Tabs[] => [
  {
    tabValue: 'basic',
    tabName: 'Registration Detail',
    tabDescription: 'Basic Registration Information',
    tabPanelComponent: (
      <BasicInfo register={extendedRegister} control={control} />
    ),
  },
  {
    tabValue: 'address',
    tabName: 'Address Information',
    tabDescription: 'Company Address Information',
    tabPanelComponent: (
      <AddressInformation register={extendedRegister} control={control} />
    ),
  },
  {
    tabValue: 'contactPersons',
    tabName: 'Contact Persons Information',
    tabDescription: 'Contact Persons List',
    tabPanelComponent: (
      <ContactPersons
        name="contactPersons"
        control={control}
        itemSchema={contactPersonSchema}
        disabled={disabled}
      />
    ),
  },
  {
    tabValue: 'businessSizeAndOwnership',
    tabName: 'Business Size and Ownership',
    tabDescription: 'Business Size and Ownership Information',
    tabPanelComponent: (
      <BusinessSizeAndOwnership register={extendedRegister} control={control} />
    ),
  },
  // {
  //   tabValue: 'shareHolders',
  //   tabName: 'Shareholders',
  //   tabDescription: 'Shareholders List',
  //   tabPanelComponent: (
  //     <ShareHolders
  //       name="shareHolders"
  //       control={control}
  //       itemSchema={shareHoldersSchema}
  //       disabled={disabled}
  //     />
  //   ),
  // },
  {
    tabValue: 'beneficialOwnershipShareholders',
    tabName: 'Beneficial Ownership/Shareholders',
    tabDescription: 'Beneficial Ownership.Shareholders List',
    tabPanelComponent: (
      <BeneficialOwnership
        name="beneficialOwnershipShareholders"
        control={control}
        itemSchema={beneficialOwnershipShareholderSchema}
        disabled={disabled}
      />
    ),
  },
  {
    tabValue: 'bankAccountDetails',
    tabName: 'Bank Account Details',
    tabDescription: 'Bank Account Details List',
    tabPanelComponent: (
      <BankAccountDetails
        name="bankAccountDetails"
        control={control}
        register={extendedRegister}
        itemSchema={bankAccountSchema}
        disabled={disabled}
      />
    ),
  },
];

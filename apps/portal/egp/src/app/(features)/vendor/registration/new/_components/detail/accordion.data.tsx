import { BusinessSizeAndOwnership } from './businessSizeAndOwnership';
import { AddressInformation } from './addressInformation';
import { BankAccountDetails } from './bankAccountDetails';
import { ShareHolders } from './shareHolders';
import { BeneficialOwnership } from './beneficialOwnership';
import { BasicInfo } from './basicInfo';
import { ContactPersons } from './contactPersons';
import {
  bankAccountSchema,
  beneficialOwnershipSchema,
  contactPersonSchema,
  shareHoldersSchema,
} from './schema';

interface Tabs {
  tabValue: string;
  tabName: string;
  tabDescription: string;
  tabPanelComponent: React.ReactNode;
}
export const useTabs = (extendedRegister, control): Tabs[] => [
  {
    tabValue: 'basic',
    tabName: 'Basic Registration',
    tabDescription: 'Basic Registration Information',
    tabPanelComponent: (
      <BasicInfo register={extendedRegister} control={control} />
    ),
  },
  {
    tabValue: 'address',
    tabName: 'Address Information',
    tabDescription: 'Address Information',
    tabPanelComponent: (
      <AddressInformation register={extendedRegister} control={control} />
    ),
  },
  {
    tabValue: 'contactPersons',
    tabName: 'Contact Persons',
    tabDescription: 'Contact Persons List',
    tabPanelComponent: (
      <ContactPersons
        name="contactPersons"
        control={control}
        itemSchema={contactPersonSchema}
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
  {
    tabValue: 'shareHolders',
    tabName: 'Shareholders',
    tabDescription: 'Shareholders List',
    tabPanelComponent: (
      <ShareHolders
        name="shareHolders"
        control={control}
        itemSchema={shareHoldersSchema}
      />
    ),
  },
  {
    tabValue: 'beneficialOwnership',
    tabName: 'Beneficial Ownership',
    tabDescription: 'Beneficial Ownership List',
    tabPanelComponent: (
      <BeneficialOwnership
        name="beneficialOwnership"
        control={control}
        itemSchema={beneficialOwnershipSchema}
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
        itemSchema={bankAccountSchema}
      />
    ),
  },
];

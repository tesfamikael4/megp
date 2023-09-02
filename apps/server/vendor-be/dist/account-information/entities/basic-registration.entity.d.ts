import { AccountInformation } from './account-information.entity';
export declare class BasicRegistration {
    id: string;
    name: string;
    formOfBusiness: string;
    companyOrigin: string;
    district: string;
    country: string;
    accountInformationId: string;
    accountInformation: AccountInformation;
}

import { AccountInformation } from './account-information.entity';
export declare class SecurityQuestion {
    id: string;
    question: string;
    answer: string;
    accountInformationId: string;
    accountInformation: AccountInformation;
}

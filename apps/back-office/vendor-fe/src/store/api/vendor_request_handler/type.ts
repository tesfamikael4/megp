export interface VendorRequests {
  serviceKey: string;
}
export interface VendorRequest {
  instanceId: string;
}
export interface tracker {
  applicationNumber: string;
  createdAt: Date;
  data: {
    createdAt: Date;
    submittedAt: Date;
    service: {
      name: string;
    };
    taskTrackers: {
      data: {
        action: string;
        remark: string;
        updatedAt: Date;
      };
    };
    name: string;
    country: string;
    metaData: {
      addressInformation: {
        primaryEmail: string;
        postalAddress: string;
        alternateEmail: string;
        telephone: string;
        mobilePhone: string;
        fax: string;
        website: string;
      };
      businessSizeAndOwnership: {
        numberOfEmployees: number;
        ownershipType: string;
        paidUpCapital: number;
        registeredCapital: number;
        mobilePhone: string;
        fax: string;
        website: string;
      };
      bankAccountDetails: {
        bankAccountDetailsTable: {
          accountHoldersFullName: string;
          accountNumber: number;
          bankSWIFT_BICCode: number;
          bankBranchAddress: string;
          bankName: string;
          currency: number;
        };
      };
      contactPersons: {
        contactPersonsTable: [
          {
            firstName: string;
            lastName: string;
            email: string;
            mobileNumber: string;
          },
        ];
      };
    };
  };
  service: {
    name: string;
  };
  task: {
    taskType: string;
  };
  attachments: [];
}

export interface Data {
  items: Item[];
  total: number;
}

export interface Item {
  id: string;
  bpId: string;
  applicationNumber: string;
  requestorId: string;
  status: string;
  submittedAt: string;
  businessProcess: BusinessProcess;
  service: Service;
  taskHandler: TaskHandler;
  task: Task;
  vendor: Vendor;
  isrvendor: any;
}

export interface BusinessProcess {
  id: string;
  serviceId: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
}

export interface TaskHandler {
  id: string;
  taskId: string;
  instanceId: string;
  handlerName: any;
  handlerUserId: any;
  pickedAt: any;
  data: Data;
  currentState: string;
  assignmentStatus: string;
  previousHandlerId?: string;
  task: any;
}

export interface Data {
  name?: string;
  remark?: string;
}

export interface Task {
  id: string;
  businessProcessId: string;
  name: string;
  description: string;
  handlerType: string;
  taskType: string;
  taskCheckList: TaskCheckList[];
  label: string;
}

export interface TaskCheckList {
  id: string;
  description: string;
  isMandatory: string;
}

export interface Vendor {
  id: string;
  tin: string;
  userId: string;
  country: string;
  name: string;
  status: string;
  metaData: MetaData;
  district: string;
  origin: string;
}

export interface MetaData {
  address: Address;
  areasOfBusinessInterest: AreasOfBusinessInterest[];
  businessSizeAndOwnership: BusinessSizeAndOwnership;
  contactPersons: ContactPerson[];
}

export interface Address {
  postal: string;
  primaryEmail: string;
  alternateEmail: string;
  mobile: string;
  phone: string;
  fax: string;
  website: string;
}

export interface AreasOfBusinessInterest {
  category: string;
  lineOfBusiness: LineOfBusiness[];
  priceRange: string;
}

export interface LineOfBusiness {
  id: string;
  name: string;
}

export interface BusinessSizeAndOwnership {
  numberOfEmployees: number;
  ownershipType: string;
  registeredCapital: RegisteredCapital;
  paidUpCapital: PaidUpCapital;
}

export interface RegisteredCapital {
  amount: number;
  currency: string;
}

export interface PaidUpCapital {
  amount: number;
  currency: string;
}

export interface ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export const seedTasks = [
  {
    id: '1a20640c-5e65-4325-a471-cf20aa19da4c',
    name: 'Submit New Vendor Registration Request',
    label: 'Submitted New Registration Request',
    description: 'Submission of New Registration application',
    bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: null,
    orderBy: 1,
  },
  {
    id: '4066d458-d4aa-483c-a466-b5483ccbd286',
    name: 'Review New Vendor Registration Request by Registration Officer',
    label: 'Reviewed Vendor Registration Request',
    description: 'Reviewing New Vendor Applications',
    bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '31fac537-e71b-479b-9c4a-7f344720598f',
    name: 'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
    label: 'Reviewed by RO',
    description:
      'aprove new  registration request for Goods by senior or chief registration officer',
    bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: 'd8f268ac-f85f-4973-94c3-134f753cd25e',
    name: 'Approval of New Vendor Registration Request by Director General (DG)',
    label: 'Approved by DG',
    description:
      'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
    bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
  {
    id: '96752a13-205f-45eb-8b6f-118ebf0c89c7',
    name: 'Generate Vendor Registration Certificate',
    label: 'Generated Certeficates',
    description:
      "Creating a formal certificate to officially recognize and document the registration of a new vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
    bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
    handlerType: 'Assignee',
    taskType: 'Certificate',
    checkList: null,
    orderBy: 5,
  },
  {
    id: '31fac247-e71b-479c-9c4a-7f344720548f',
    name: 'Submit Renewal Registration Request',
    label: 'Submitted Applications ',
    description: 'Submission of Vendor Upgrade Registration Request',
    bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 1,
  },
  {
    id: '31aac537-e71b-421c-9c4a-7f344820518f',
    name: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
    label: 'Approved Renewal Application',
    description: 'Approval of Renewal Registration Request of vendor',
    bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '61fac7e7-971b-471c-2c5a-7f344820518f',
    name: 'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM',
    label: 'Reviewed by RO/RRM/DRRM',
    description:
      'Aprove renewal  registration request for Works by senior or chief registration officer',
    bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: '31fbc734-e21b-479c-9c4a-7f384820518f',
    name: 'Approval of Renewal Registration Request of vendor by Director General (DG)',
    label: 'Approved Renewal Request by DG',
    description: 'Final Approval of Vendor registration Renewal by DG',
    bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
  {
    id: '41fbc737-e712-471c-9c4b-7f345820538f',
    name: 'Generate Vendor Registration Certificate',
    label: 'Generated Certeficate',
    description:
      "Creating a formal certificate to officially recognize and document the upgrade of  vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
    bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
    handlerType: 'Assignee',
    taskType: 'Certificate',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 5,
  },
  {
    id: '96752a13-201f-45eb-8b6f-118ebf0c89c7',
    name: 'Submission of Micro Enterprises(ME) Registration Request',
    label: 'Submitted Micro Enterprises(ME) Request',
    description: 'Submission of Micro Enterprises(ME) Registration Request',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: null,
    orderBy: 1,
  },
  {
    id: '26752a13-201f-45eb-8b6f-118ebf0c79c9',
    name: 'Review Micro Enterprises(ME) Registration Request by Registration Officer',
    label: 'Reviewed ME Registration Request',
    description: 'Reviewing Vendor ME Applications',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '16752a13-205f-15eb-8b5f-118ebf0c21c7',
    name: 'Approval of Micro Enterprises(ME) Registration Request by Senior or chief registration officer or RRM/DRRM',
    label: 'Reviewed by RO',
    description:
      'Approve  Micro Enterprises(ME) registration request for Goods by senior or chief registration officer',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: '12752a13-205f-15eb-8b5f-118ebf0c29c6',
    name: 'Approval of Micro Enterprises(ME) Registration Request by Director General (DG)',
    label: 'Approved by DG',
    description:
      'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
  {
    id: '85d95fdb-7852-4ddc-912f-0e94d23d15d3',
    name: 'Generate Vendor Registration Certificate',
    label: 'Generated Certificate',
    description: 'Generate Vendor Registration Certificate',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
    handlerType: 'Assignee',
    taskType: 'Certificate',
    checkList: [],
    orderBy: 5,
  },
  {
    id: '95752a14-201f-45eb-8b6f-218ebf0c89c7',
    name: 'Submission of Small Enterprises(SE) Registration Request',
    label: 'Submitted Small Enterprises(SE) Request',
    description: 'Submission of Small Enterprises(SE) Registration Request',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: null,
    orderBy: 1,
  },
  {
    id: '26752a13-201f-45eb-8b6f-118ebf0c19c9',
    name: 'Review Small Enterprises(SE) Registration Request by Registration Officer',
    label: 'Reviewed ME Registration Request',
    description: 'Reviewing Vendor ME Applications',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '16752a13-205f-15eb-8b5f-118ebf0c29c7',
    name: 'Approval of Small Enterprises(SE) Registration Request by Senior or chief registration officer or RRM/DRRM',
    label: 'Reviewed by RO',
    description:
      'Approve Small Enterprises(SE) registration request for Goods by senior or chief registration officer',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: '56752a13-205f-15eb-8b5f-118ebf0c29c6',
    name: 'Approval of Small Enterprises(SE) Registration Request by Director General (DG)',
    label: 'Approved by DG',
    description:
      'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
  {
    id: 'c0aa3814-f987-4ff1-af34-0ceda8cc9b51',
    name: 'Generate Vendor Registration Certificate',
    label: 'Generated Certificate',
    description: 'Generate Vendor Registration Certificate',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
    handlerType: 'Assignee',
    taskType: 'Certificate',
    checkList: [],
    orderBy: 5,
  },
  {
    id: '16752a13-201f-45eb-8b6f-118ebf0c89c4',
    name: 'Submission of Medium Enterprise Registration Request',
    label: 'Submitted Medium Enterprise Request',
    description: 'Submission of Medium Enterprises Registration Request',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: null,
    orderBy: 1,
  },
  {
    id: '96752a13-201f-45eb-8b6f-118ebf0c89c9',
    name: 'Review Medium Enterprise Registration Request by Registration Officer',
    label: 'Reviewed ME Registration Request',
    description: 'Reviewing Vendor ME Applications',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '96752a13-205f-15eb-8b5f-118ebf0c29c1',
    name: 'Approval of Medium Enterprise Registration Request by Senior or chief registration officer or RRM/DRRM',
    label: 'Reviewed by RO',
    description:
      'Approve  Medium Enterprise registration request for Goods by senior or chief registration officer',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: '16752a13-205f-15eb-8b5f-118ebf0c29c1',
    name: 'Approval of Medium Enterprise Registration Request by Director General (DG)',
    label: 'Approved by DG',
    description:
      'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
  {
    id: '16752a13-205f-11eb-8b5f-118ebf0c29c2',
    name: 'Generate Vendor Registration Certificate',
    label: 'Generated Certificate',
    description: 'Generate Vendor Registration Certificate',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
    handlerType: 'Assignee',
    taskType: 'Certificate',
    checkList: [],
    orderBy: 5,
  },
  {
    id: '96752a13-205f-45eb-8b5f-118ebf0c89c7',
    name: 'Submission of indigenous black Malawian(IBM) Registration Request',
    label: 'Submitted IBM request',
    description:
      'Submission of indigenous black Malawian(IBM) Registration Request',
    bpId: '329201c3-3218-4e6c-8478-39bee76a43a6',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-912f-0e94d23d15d3',
        description:
          'The Attached IBM certeficate and  other documents are valid.',
        isMandatory: 'true',
      },
    ],
    orderBy: 1,
  },
  {
    id: '96752a13-205f-45eb-8b5f-118ebf0c29c7',
    name: 'Review indigenous black Malawian(IBM) Registration Request by Registration Officer',
    label: 'Reviewed IBM Registration Request',
    description: 'Reviewing Vendor IBM Applications',
    bpId: '329201c3-3218-4e6c-8478-39bee76a43a6',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '96752a13-205f-15eb-8b5f-118ebf0c29c7',
    name: 'Approval of indigenous black Malawian(IBM) Registration Request by Senior or chief registration officer or RRM/DRRM',
    label: 'Reviewed by RO.4',
    description:
      'aprove indigenous black Malawian(IBM)  registration request for Goods by senior or chief registration officer',
    bpId: '329201c3-3218-4e6c-8478-39bee76a43a6',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: '16752a13-205f-15eb-8b5f-118ebf0c29c8',
    name: 'Approval of indigenous black Malawian(IBM) Registration Request by Director General (DG)',
    label: 'Approved by DG',
    description:
      'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
    bpId: '329201c3-3218-4e6c-8478-39bee76a43a6',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
  {
    id: '16752a13-205f-45eb-8b5f-118ebf0c29c1',
    name: 'Generate Vendor Registration Certificate',
    label: 'Generated Certeficate',
    description: 'Generate Vendor Registration Certificate',
    bpId: '329201c3-3218-4e6c-8478-39bee76a43a6',
    handlerType: 'Assignee',
    taskType: 'Certificate',
    checkList: [],
    orderBy: 3,
  },
  {
    id: '85752a13-201f-45eb-8b6f-118ebf0c89c7',
    name: 'Submission of Marginalized Group Registration Request',
    label: 'Submitted MG Request',
    description: 'Submission of Marginalized Group Registration Request',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: null,
    orderBy: 1,
  },
  {
    id: '71752a13-201f-45eb-8b6f-118ebf0c89c4',
    name: 'Review Marginalized Group Registration Request by Registration Officer',
    label: 'Reviewed Marginalized Group Request',
    description: 'Reviewing Marginalized Group Applications',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '96752a13-205f-15eb-8b5f-118ebf0c29c4',
    name: 'Approval of Marginalized Group Registration Request by Senior or chief registration officer or RRM/DRRM',
    label: 'Reviewed by RO',
    description:
      'aprove Marginalized Group registration request by senior or chief registration officer',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: '16752a13-205f-15eb-8b5f-118ebf0c29c2',
    name: 'Approval of Marginalized Group Registration Request by Director General (DG)',
    label: 'Approved by DG',
    description:
      'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
  {
    id: '12752a13-205f-11eb-8b5f-118ebf0c21c2',
    name: 'Generate Vendor Registration Certificate',
    label: 'Generated Certeficate',
    description: 'Generate Vendor Registration Certificate',
    bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
    handlerType: 'Assignee',
    taskType: 'Certificate',
    checkList: [],
    orderBy: 5,
  },
  {
    id: '31fac537-e71b-479c-9c4a-7b344724518f',
    name: 'Submit Vendor Upgrade Registration Request',
    label: 'Submitted Applications',
    description: 'Submission of Vendor Upgrade Registration Request',
    bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 1,
  },
  {
    id: '31fac517-e71b-419c-9c4a-7f344820518f',
    name: 'Review Upgrade Registration Request of Vendor by Registration Officer',
    label: 'Approved Uppgrade Application',
    description: 'Approval of Vendor Upgrade Registration Request',
    bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '34fac737-e51b-479c-9c4a-7f344820518f',
    name: 'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM',
    label: 'Approved Uppgrade Request by CRO/RRM/DRRM',
    description:
      'Aprove upgrade registration request by senior or chief registration officer',
    bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: '31fac787-e71b-471c-9c4a-7f344820318f',
    name: 'Approval of Upgrade Registration Request of vendor by Director General (DG)',
    label: 'Approved Uppgrade Request by DG',
    description: 'Final Approval of Vendor Upgrade by DG',
    bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-1852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
  {
    id: '41fac737-e76b-471c-9c4a-7f344820518f',
    name: 'Generate Vendor Registration Certificate',
    label: 'Generated Certeficate',
    description:
      "Creating a formal certificate to officially recognize and document the upgrade registration of a vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
    bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
    handlerType: 'Assignee',
    taskType: 'Certificate',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 5,
  },
  {
    id: '35967d94-dcaa-4449-8b55-a70350f5e698',
    name: 'Submission of Vendor Profile Update Request',
    label: 'Requested Vendor Profile Update',
    description: 'Vendor Profile Update Request',
    bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
    handlerType: 'Requestor',
    taskType: 'ISR',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e14d23d15d3',
        description: 'The bank account information is valid',
        isMandatory: 'true',
      },
    ],
    orderBy: 1,
  },
  {
    id: '277e4d2f-f996-4546-9320-3d5103e22c63',
    name: 'Review Vendor Profile Update Request by Registration Officer',
    label: 'Reviewed Vendor Registration Request',
    description: 'Reviewing VendorProfile update',
    bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
    handlerType: 'Assignee',
    taskType: 'InitialReview',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 2,
  },
  {
    id: '81fac537-e71b-479b-9c4a-7f344720598f',
    name: 'Approval of Vendor Profile Update Request by Senior or chief registration officer or RRM/DRRM',
    label: 'Reviewed by RO',
    description:
      'aprove Vendor Profile Update Request by senior or chief registration officer',
    bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
    handlerType: 'Assignee',
    taskType: 'Confirmation',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 3,
  },
  {
    id: 'd9f268ac-f85f-4973-94c3-134f753cd24e',
    name: 'Approval of Vendor Profile update Request by Director General (DG)',
    label: 'Approved by DG',
    description:
      'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
    bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
    handlerType: 'Assignee',
    taskType: 'Approval',
    checkList: [
      {
        id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
        description:
          'All the required information and related documents fullfilled',
        isMandatory: 'true',
      },
    ],
    orderBy: 4,
  },
];

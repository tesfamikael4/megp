export const seedBps = [
  {
    tenantId: 0,
    id: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
    serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
    workflow: {
      id: 'New Registration',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
            apiUrl: '',
          },
        },
        'Submit New Vendor Registration Request': {
          on: {
            ISR: 'Review New Vendor Registration Request by Registration Officer',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review New Vendor Registration Request by Registration Officer': {
          on: {
            ADJUST: 'Submit New Vendor Registration Request',
            CANCEL: 'End',
            APPROVE:
              'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
          },
          meta: {
            type: 'InitialReview',
          },
        },
        'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM':
          {
            on: {
              NO: 'Submit New Vendor Registration Request',
              YES: 'Approval of New Vendor Registration Request by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of New Vendor Registration Request by Director General (DG)':
          {
            on: {
              ADJUST: 'Submit New Vendor Registration Request',
              APPROVE: 'Generate Vendor Registration Certificate',
              REJECT: 'End',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Generate Vendor Registration Certificate': {
          on: {
            FAIL: 'Generate Vendor Registration Certificate',
            SUCCESS: 'End',
          },
          meta: {
            type: 'Certificate',
          },
        },
      },
      initial: 'Submit New Vendor Registration Request',
    },
    version: 0,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
  {
    tenantId: 0,
    id: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
    serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
    workflow: {
      id: 'Renewal of Goods, services, and works',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
            apiUrl: '',
          },
        },
        'Submit Renewal Registration Request': {
          on: {
            ISR: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review Vendor Renewal Registration Request by Registration Officer(RO)':
          {
            on: {
              ADJUST: 'Submit Renewal Registration Request',
              CANCEL: 'End',
              APPROVE:
                'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM',
            },
            meta: {
              type: 'InitialReview',
            },
          },
        'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM':
          {
            on: {
              NO: 'Submit Renewal Registration Request',
              YES: 'Approval of Renewal Registration Request of vendor by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of Renewal Registration Request of vendor by Director General (DG)':
          {
            on: {
              APPROVE: 'Generate Vendor Registration Certificate',
              ADJUST: 'Submit Renewal Registration Request',
              REJECT: 'End',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Generate Vendor Registration Certificate': {
          on: {
            FAIL: 'Generate Vendor Registration Certificate',
            SUCCESS: 'End',
          },
          meta: {
            type: 'Certificate',
          },
        },
      },
      initial: 'Submit Renewal Registration Request',
    },
    version: 0,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
  {
    tenantId: 0,
    id: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
    serviceId: '22be510e-033e-415b-9e3e-8f9795c01711',
    workflow: {
      id: 'Upgrade of Goods,Services, Works',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
          },
        },
        'Submit Vendor Upgrade Registration Request': {
          on: {
            ISR: 'Review Upgrade Registration Request of Vendor by Registration Officer',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review Upgrade Registration Request of Vendor by Registration Officer':
          {
            on: {
              ADJUST: 'Submit Vendor Upgrade Registration Request',
              CANCEL: 'End',
              APPROVE:
                'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM',
            },
            meta: {
              type: 'InitialReview',
            },
          },
        'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM':
          {
            on: {
              NO: 'Submit Vendor Upgrade Registration Request',
              YES: 'Approval of Upgrade Registration Request of vendor by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of Upgrade Registration Request of vendor by Director General (DG)':
          {
            on: {
              APPROVE: 'Generate Vendor Registration Certificate',
              ADJUST: 'Submit Vendor Upgrade Registration Request',
              REJECT: 'End',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Generate Vendor Registration Certificate': {
          on: {
            FAIL: 'Generate Vendor Registration Certificate',
            SUCCESS: 'End',
          },
          meta: {
            type: 'Certificate',
          },
        },
      },
      initial: 'Submit Vendor Upgrade Registration Request',
    },
    version: 0,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
  {
    tenantId: 0,
    id: '329201c3-3218-4e6c-8478-39bee76a43a6',
    serviceId: '26ff8e51-0f68-9c28-2ea4-a32a5e1f184f',
    workflow: {
      id: 'IBM Registration',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
            apiUrl: '',
          },
        },
        'Submission of indigenous black Malawian(IBM) Registration Request': {
          on: {
            ISR: 'Review indigenous black Malawian(IBM) Registration Request by Registration Officer',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review indigenous black Malawian(IBM) Registration Request by Registration Officer':
          {
            on: {
              ADJUST:
                'Submission of indigenous black Malawian(IBM) Registration Request',
              CANCEL: 'End',
              APPROVE:
                'Approval of indigenous black Malawian(IBM) Registration Request by Senior or chief registration officer or RRM/DRRM',
            },
            meta: {
              type: 'InitialReview',
            },
          },
        'Approval of indigenous black Malawian(IBM) Registration Request by Senior or chief registration officer or RRM/DRRM':
          {
            on: {
              NO: 'Submission of indigenous black Malawian(IBM) Registration Request',
              YES: 'Approval of indigenous black Malawian(IBM) Registration Request by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of indigenous black Malawian(IBM) Registration Request by Director General (DG)':
          {
            on: {
              ADJUST:
                'Submission of indigenous black Malawian(IBM) Registration Request',
              APPROVE: 'Generate Vendor Registration Certificate',
              REJECT: 'End',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Generate Vendor Registration Certificate': {
          on: {
            FAIL: 'Generate Vendor Registration Certificate',
            SUCCESS: 'End',
          },
          meta: {
            type: 'Certificate',
          },
        },
      },
      initial:
        'Submission of indigenous black Malawian(IBM) Registration Request',
    },
    version: 0,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
  {
    tenantId: 0,
    id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
    serviceId: 'a63fb5b1-9896-8c73-4fd0-882d4e9a6e9a',
    workflow: {
      id: 'Medium Enterprise WF',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
            apiUrl: '',
          },
        },
        'Submission of Medium Enterprise Registration Request': {
          on: {
            ISR: 'Review Medium Enterprise Registration Request by Registration Officer',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review Medium Enterprise Registration Request by Registration Officer':
          {
            on: {
              ADJUST: 'Submission of Medium Enterprise Registration Request',
              CANCEL: 'End',
              APPROVE:
                'Approval of Medium Enterprise Registration Request by Senior or chief registration officer or RRM/DRRM',
            },
            meta: {
              type: 'InitialReview',
            },
          },
        'Approval of Medium Enterprise Registration Request by Senior or chief registration officer or RRM/DRRM':
          {
            on: {
              NO: 'Submission of Medium Enterprise Registration Request',
              YES: 'Approval of Medium Enterprise Registration Request by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of Medium Enterprise Registration Request by Director General (DG)':
          {
            on: {
              ADJUST: 'Submission of Medium Enterprise Registration Request',
              APPROVE: 'Generate Vendor Registration Certificate',
              REJECT: 'End',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Generate Vendor Registration Certificate': {
          on: {
            FAIL: 'Generate Vendor Registration Certificate',
            SUCCESS: 'End',
          },
          meta: {
            type: 'Certificate',
          },
        },
      },
      initial: 'Submission of Medium Enterprise Registration Request',
    },
    version: 0,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
  {
    tenantId: 0,
    id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
    serviceId: 'a63fb5b2-9896-8c73-4fd0-882d4e9a6e4a',
    workflow: {
      id: 'Small Enterprises(SE)',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
            apiUrl: '',
          },
        },
        'Submission of Small Enterprises(SE) Registration Request': {
          on: {
            ISR: 'Review Small Enterprises(SE) Registration Request by Registration Officer',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review Small Enterprises(SE) Registration Request by Registration Officer':
          {
            on: {
              ADJUST:
                'Submission of Small Enterprises(SE) Registration Request',
              CANCEL: 'End',
              APPROVE:
                'Approval of Small Enterprises(SE) Registration Request by Senior or chief registration officer or RRM/DRRM',
            },
            meta: {
              type: 'InitialReview',
            },
          },
        'Approval of Small Enterprises(SE) Registration Request by Senior or chief registration officer or RRM/DRRM':
          {
            on: {
              NO: 'Submission of Small Enterprises(SE) Registration Request',
              YES: 'Approval of Small Enterprises(SE) Registration Request by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of Small Enterprises(SE) Registration Request by Director General (DG)':
          {
            on: {
              ADJUST:
                'Submission of Small Enterprises(SE) Registration Request',
              APPROVE: 'Generate Vendor Registration Certificate',
              REJECT: 'End',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Generate Vendor Registration Certificate': {
          on: {
            FAIL: 'Generate Vendor Registration Certificate',
            SUCCESS: 'End',
          },
          meta: {
            type: 'Certificate',
          },
        },
      },
      initial: 'Submission of Small Enterprises(SE) Registration Request',
    },
    version: 0,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
  {
    tenantId: 0,
    id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
    serviceId: 'a54fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
    workflow: {
      id: 'Micro Enterprises(ME)',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
            apiUrl: '',
          },
        },
        'Submission of Micro Enterprises(ME) Registration Request': {
          on: {
            ISR: 'Review Micro Enterprises(ME) Registration Request by Registration Officer',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review Micro Enterprises(ME) Registration Request by Registration Officer':
          {
            on: {
              ADJUST:
                'Submission of Micro Enterprises(ME) Registration Request',
              CANCEL: 'End',
              APPROVE:
                'Approval of Micro Enterprises(ME) Registration Request by Senior or chief registration officer or RRM/DRRM',
            },
            meta: {
              type: 'InitialReview',
            },
          },
        'Approval of Micro Enterprises(ME) Registration Request by Senior or chief registration officer or RRM/DRRM':
          {
            on: {
              NO: 'Submission of Micro Enterprises(ME) Registration Request',
              YES: 'Approval of Micro Enterprises(ME) Registration Request by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of Micro Enterprises(ME) Registration Request by Director General (DG)':
          {
            on: {
              ADJUST:
                'Submission of Micro Enterprises(ME) Registration Request',
              APPROVE: 'Generate Vendor Registration Certificate',
              REJECT: 'End',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Generate Vendor Registration Certificate': {
          on: {
            FAIL: 'Generate Vendor Registration Certificate',
            SUCCESS: 'End',
          },
          meta: {
            type: 'Certificate',
          },
        },
      },
      initial: 'Submission of Micro Enterprises(ME) Registration Request',
    },
    version: 0,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
  {
    tenantId: 0,
    id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
    serviceId: 'a16fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
    workflow: {
      id: 'Marginalized Group Registration',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
            apiUrl: '',
          },
        },
        'Submission of Marginalized Group Registration Request': {
          on: {
            ISR: 'Review Marginalized Group Registration Request by Registration Officer',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review Marginalized Group Registration Request by Registration Officer':
          {
            on: {
              ADJUST: 'Submission of Marginalized Group Registration Request',
              CANCEL: 'End',
              APPROVE:
                'Approval of Marginalized Group Registration Request by Senior or chief registration officer or RRM/DRRM',
            },
            meta: {
              type: 'InitialReview',
            },
          },
        'Approval of Marginalized Group Registration Request by Senior or chief registration officer or RRM/DRRM':
          {
            on: {
              NO: 'Submission of Marginalized Group Registration Request',
              YES: 'Approval of Marginalized Group Registration Request by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of Marginalized Group Registration Request by Director General (DG)':
          {
            on: {
              ADJUST: 'Submission of Marginalized Group Registration Request',
              APPROVE: 'Generate Vendor Registration Certificate',
              REJECT: 'End',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Generate Vendor Registration Certificate': {
          on: {
            FAIL: 'Generate Vendor Registration Certificate',
            SUCCESS: 'End',
          },
          meta: {
            type: 'Certificate',
          },
        },
      },
      initial: 'Submission of Marginalized Group Registration Request',
    },
    version: 0,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
  {
    tenantId: 0,
    id: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
    serviceId: 'a044b8d0-d653-5dd3-fd34-1f67d19ebf03',
    workflow: {
      id: 'Profile update Workflow',
      states: {
        End: {
          on: {},
          meta: {
            type: 'end',
            apiUrl: '',
          },
        },
        'Submission of Vendor Profile Update Request': {
          on: {
            ISR: 'Review Vendor Profile Update Request by Registration Officer',
          },
          meta: {
            type: {
              start: true,
            },
          },
        },
        'Review Vendor Profile Update Request by Registration Officer': {
          on: {
            ADJUST: 'Submission of Vendor Profile Update Request',
            CANCEL: 'End',
            APPROVE:
              'Approval of Vendor Profile Update Request by Senior or chief registration officer or RRM/DRRM',
          },
          meta: {
            type: 'InitialReview',
          },
        },
        'Approval of Vendor Profile Update Request by Senior or chief registration officer or RRM/DRRM':
          {
            on: {
              NO: 'Submission of Vendor Profile Update Request',
              YES: 'Approval of Vendor Profile update Request by Director General (DG)',
            },
            meta: {
              type: 'Confirmation',
            },
          },
        'Approval of Vendor Profile update Request by Director General (DG)': {
          on: {
            ADJUST: 'Submission of Vendor Profile Update Request',
            APPROVE: 'End',
            REJECT: 'End',
          },
          meta: {
            type: 'Confirmation',
          },
        },
      },
      initial: 'Submission of Vendor Profile Update Request',
    },
    version: 1,
    isActive: true,
    organizationId: null,
    organizationName: null,
  },
];

export const seedRules = [
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    key: 'ruleOne',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'goods',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '30000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    key: 'ruleTwo',
    executionOrder: 2,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'works',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    key: 'ruleThree',
    executionOrder: 3,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'services',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '30000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    key: 'ruleFour',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'goods',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '500000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '30000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    key: 'ruleFive',
    executionOrder: 2,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'works',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    key: 'ruleSix',
    executionOrder: 3,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'works',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '5000000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    key: 'ruleSeven',
    executionOrder: 4,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'services',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '30000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'bbe7f803-cb78-4f80-9e4f-0f6a4ff01d51',
    key: 'ruleEight',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'goods',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '500000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'bbe7f803-cb78-4f80-9e4f-0f6a4ff01d51',
    key: 'ruleNine',
    executionOrder: 2,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'goods',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '500000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'bbe7f803-cb78-4f80-9e4f-0f6a4ff01d51',
    key: 'ruleTen',
    executionOrder: 3,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'works',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '5000000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '99a4e21f-b91d-484b-a291-e637366526ee',
    key: 'ruleEleven',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'consultancy',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '20000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '303bf39a-070e-4185-8439-a211efa1cbe2',
    key: 'ruleTwelve',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'consultancy',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<',
          value: '20000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'b43d5aee-540d-4a54-a10f-0cf773e3388d',
    key: 'ruleThirteen',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'consultancy',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '20000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'ba4f1f53-8590-4ae9-a9b9-74878e083ef9',
    key: 'ruleFourteen',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'consultancy',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '20000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'f0437508-dcaf-42bd-8df9-27aedeb53162',
    key: 'ruleFifteen',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'goods',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<',
          value: '10000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '4f5f19cc-e91a-47e9-a2a3-1d3db37effa4',
    key: 'ruleSixteen',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'goods',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'bdbcc63e-9140-4ec8-81fc-1f511d00717f',
    key: 'ruleSeventeen',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'goods',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'bdbcc63e-9140-4ec8-81fc-1f511d00717f',
    key: 'ruleEighteen',
    executionOrder: 2,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'consultancy',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '8531bdf2-f40f-4e06-805a-d835f93b36b4',
    key: 'ruleNineteen',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'goods',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '8531bdf2-f40f-4e06-805a-d835f93b36b4',
    key: 'ruleTwenty',
    executionOrder: 2,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'consultancy',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '8531bdf2-f40f-4e06-805a-d835f93b36b4',
    key: 'ruleTwentyone',
    executionOrder: 3,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'consultancy',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'valueThreshold',
          operator: '>=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '2c66c5f0-4e23-4936-a24c-32b47e9c956e',
    key: 'ruleTwentytwo',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementMethod',
          operator: '==',
          value: 'ncb',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'preferncePercentage',
          operator: '>=',
          value: '0.6',
          type: 'decimal',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '87bfcff1-4528-4963-a620-83c94e5ef0ef',
    key: 'ruleTwentythree',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementMethod',
          operator: '==',
          value: 'rfq',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'IBM',
          type: 'string',
          joinType: '||',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'Marginalized Group',
          type: 'string',
          joinType: '||',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'Micro',
          type: 'string',
          joinType: '||',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'Small',
          type: 'string',
          joinType: '||',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'Medium',
          type: 'string',
          joinType: '||',
        },
      ],
    ],
  },
];
export const seedDesigns = [
  {
    enforcementMethod: 'FLAG',
    actions: [
      { type: 'validate' },
      { type: 'set', name: 'sth', value: 'value' },
    ],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Request for quotation',
    key: 'requestForQuotation',
    id: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'National Competitive Bidding',
    key: 'nationalCompetitiveBidding',
    id: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'International Competitive Bidding',
    key: 'internationalCompetitiveBidding',
    id: 'bbe7f803-cb78-4f80-9e4f-0f6a4ff01d51',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Short listing',
    key: 'shortListing',
    id: '99a4e21f-b91d-484b-a291-e637366526ee',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Expression of Interest',
    key: 'expressionOfInterest',
    id: '303bf39a-070e-4185-8439-a211efa1cbe2',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'NCB Expression of Interest',
    key: 'ncbExpressionOfInterest',
    id: 'b43d5aee-540d-4a54-a10f-0cf773e3388d',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'ICB Expression of Interest',
    key: 'icbExpressionOfInterest',
    id: 'ba4f1f53-8590-4ae9-a9b9-74878e083ef9',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Single source',
    key: 'singleSource',
    id: 'f0437508-dcaf-42bd-8df9-27aedeb53162',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Micro',
    key: 'micro',
    id: '4f5f19cc-e91a-47e9-a2a3-1d3db37effa4',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Small',
    key: 'small',
    id: 'bdbcc63e-9140-4ec8-81fc-1f511d00717f',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Medium',
    key: 'medium',
    id: '8531bdf2-f40f-4e06-805a-d835f93b36b4',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [
      { type: 'validate' },
      { type: 'set', name: 'recommend', value: 'comply,not comply' },
    ],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'IBM Restriction Percentage',
    key: 'ibmRestrictionPercentage',
    id: '2c66c5f0-4e23-4936-a24c-32b47e9c956e',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [
      { type: 'validate' },
      { type: 'set', name: 'recommend', value: 'comply,not comply' },
    ],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'RFQ Restriction',
    key: 'rfqRestriction',
    id: '87bfcff1-4528-4963-a620-83c94e5ef0ef',
  },
];
export const seedPossibleReasons = [
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    reason:
      'Adoption of new cost-effective technologies or materials that impact the quotation process.',
  },
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    reason: 'Changes in market dynamics affecting supplier pricing strategies.',
  },
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    reason:
      'Internal initiatives to streamline the procurement process for efficiency.',
  },
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    reason:
      'Emergence of more cost-effective suppliers after the initial quotation request.',
  },
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    reason:
      'Changes in project specifications or quantities requiring revised quotations.',
  },
  {
    designerId: 'cc2843d7-c20b-4bcb-b619-c978b30ceed6',
    reason: 'Legal challenges or concerns regarding the RFQ process.',
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    reason:
      'Change in supplier availability due to unforeseen events (e.g., natural disasters, economic crises).',
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    reason:
      'Changes in project financing necessitating a reevaluation of procurement strategies.',
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    reason:
      'Legal challenges or concerns regarding the open tendering process.',
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    reason: 'Change in market conditions, leading to a lack of competition.',
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    reason:
      'Emergence of new, more qualified suppliers after the initial tender announcement.',
  },
  {
    designerId: '6c265e97-4498-4d89-9ccd-c2bbb3c56509',
    reason: 'Unexpected changes in project scope or specifications.',
  },
  {
    designerId: '99a4e21f-b91d-484b-a291-e637366526ee',
    reason:
      'Introduction of new technology or methodologies that require expertise from a broader range of suppliers.',
  },
  {
    designerId: '99a4e21f-b91d-484b-a291-e637366526ee',
    reason:
      'Changes in government policies or regulations affecting supplier selection criteria.',
  },
  {
    designerId: '99a4e21f-b91d-484b-a291-e637366526ee',
    reason:
      'Internal organizational changes impacting the composition of the supplier pool.',
  },
  {
    designerId: '99a4e21f-b91d-484b-a291-e637366526ee',
    reason:
      'Identification of additional qualified suppliers after the initial selection.',
  },
  {
    designerId: '99a4e21f-b91d-484b-a291-e637366526ee',
    reason:
      'Changes in project requirements necessitating a broader pool of suppliers.',
  },
  {
    designerId: '99a4e21f-b91d-484b-a291-e637366526ee',
    reason: 'Legal challenges or concerns regarding the selectivity criteria.',
  },
  {
    designerId: '303bf39a-070e-4185-8439-a211efa1cbe2',
    reason:
      'Emergence of innovative solutions or technologies that prompt a reassessment of proposal requirements.',
  },
  {
    designerId: '303bf39a-070e-4185-8439-a211efa1cbe2',
    reason:
      'Changes in project stakeholders or decision-makers necessitating a reevaluation of criteria.',
  },
  {
    designerId: '303bf39a-070e-4185-8439-a211efa1cbe2',
    reason:
      'Internal capacity-building initiatives requiring a more detailed proposal review.',
  },
  {
    designerId: '303bf39a-070e-4185-8439-a211efa1cbe2',
    reason:
      'Need for a more detailed proposal evaluation due to project complexity.',
  },
  {
    designerId: '303bf39a-070e-4185-8439-a211efa1cbe2',
    reason:
      'Changes in project scope or requirements that necessitate a new proposal.',
  },
  {
    designerId: '303bf39a-070e-4185-8439-a211efa1cbe2',
    reason: 'Legal challenges or concerns regarding the RFP process.',
  },
  {
    designerId: 'f0437508-dcaf-42bd-8df9-27aedeb53162',
    reason:
      'Changes in supplier capacity or reliability affecting the single-source decision.',
  },
  {
    designerId: 'f0437508-dcaf-42bd-8df9-27aedeb53162',
    reason:
      "Shift in the organization's risk tolerance or risk management approach.",
  },
  {
    designerId: 'f0437508-dcaf-42bd-8df9-27aedeb53162',
    reason:
      'External pressures or legal challenges prompting a reevaluation of the direct procurement method.',
  },
  {
    designerId: 'f0437508-dcaf-42bd-8df9-27aedeb53162',
    reason:
      'Identification of additional qualified suppliers after the initial decision.',
  },
  {
    designerId: 'f0437508-dcaf-42bd-8df9-27aedeb53162',
    reason:
      'Changes in project scope or specifications requiring a new procurement approach.',
  },
  {
    designerId: 'f0437508-dcaf-42bd-8df9-27aedeb53162',
    reason:
      'Legal challenges or concerns regarding the direct procurement decision.',
  },
];

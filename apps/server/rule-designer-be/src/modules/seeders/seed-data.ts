export const seedRules = [
  {
    designerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
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
    designerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
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
    designerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
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
    designerId: '0ad11b9b-d3b8-448d-bd16-8bcad60973b3',
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
    designerId: '0ad11b9b-d3b8-448d-bd16-8bcad60973b3',
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
    designerId: '0ad11b9b-d3b8-448d-bd16-8bcad60973b3',
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
    designerId: '0ad11b9b-d3b8-448d-bd16-8bcad60973b3',
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
    designerId: 'ac3adcd7-ae88-4d01-8544-e571cae238e9',
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
    designerId: 'ac3adcd7-ae88-4d01-8544-e571cae238e9',
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
    designerId: 'ac3adcd7-ae88-4d01-8544-e571cae238e9',
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
    designerId: '6d0ee241-9c8b-46a8-af4f-dc99f99a31c0',
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
    designerId: '5077df11-c603-4ae0-b9ba-23bcc76b34f2',
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
    designerId: '3307858e-5234-4476-91bc-1144a4430616',
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
    designerId: 'd268f22b-d540-4abf-a201-e36c5efba2e2',
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
    designerId: '44d8ffef-cde6-4a61-a9a8-ba0854d26396',
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
    designerId: '7ea1834e-711d-4e9a-9c5b-43845c1e1532',
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
    designerId: '9c825356-26a8-445e-8504-db0a04eee017',
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
    designerId: '9c825356-26a8-445e-8504-db0a04eee017',
    key: 'rule18',
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
    designerId: '990570a5-e3f9-4ea6-b930-30518f82a318',
    key: 'rule19',
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
    designerId: '990570a5-e3f9-4ea6-b930-30518f82a318',
    key: 'rule20',
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
    designerId: '990570a5-e3f9-4ea6-b930-30518f82a318',
    key: 'rule21',
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
    designerId: '7338db29-8d1e-4952-9991-78627e34d73d',
    key: 'rule22',
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
    designerId: 'a831ac69-55f9-4f8e-b71d-6a07a48709e3',
    key: 'rule23',
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
    id: '535df5f5-c24f-43f9-b655-874afc2eeee5',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'National Competitive Bidding',
    key: 'nationalCompetitiveBidding',
    id: '0ad11b9b-d3b8-448d-bd16-8bcad60973b3',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'International Competitive Bidding',
    key: 'internationalCompetitiveBidding',
    id: 'ac3adcd7-ae88-4d01-8544-e571cae238e9',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Short listing',
    key: 'shortListing',
    id: '6d0ee241-9c8b-46a8-af4f-dc99f99a31c0',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Expression of Interest',
    key: 'expressionOfInterest',
    id: '5077df11-c603-4ae0-b9ba-23bcc76b34f2',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'NCB Expression of Interest',
    key: 'ncbExpressionOfInterest',
    id: '3307858e-5234-4476-91bc-1144a4430616',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'ICB Expression of Interest',
    key: 'icbExpressionOfInterest',
    id: 'd268f22b-d540-4abf-a201-e36c5efba2e2',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Single source',
    key: 'singleSource',
    id: '44d8ffef-cde6-4a61-a9a8-ba0854d26396',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Micro',
    key: 'micro',
    id: '7ea1834e-711d-4e9a-9c5b-43845c1e1532',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Small',
    key: 'small',
    id: '9c825356-26a8-445e-8504-db0a04eee017',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Medium',
    key: 'medium',
    id: '990570a5-e3f9-4ea6-b930-30518f82a318',
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
    id: '7338db29-8d1e-4952-9991-78627e34d73d',
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
    id: 'a831ac69-55f9-4f8e-b71d-6a07a48709e3',
  },
];
export const seedPossibleReasons = [
  {
    ruleDesignerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
    reason:
      'Adoption of new cost-effective technologies or materials that impact the quotation process.',
  },
  {
    ruleDesignerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
    reason: 'Changes in market dynamics affecting supplier pricing strategies.',
  },
  {
    ruleDesignerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
    reason:
      'Internal initiatives to streamline the procurement process for efficiency.',
  },
  {
    ruleDesignerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
    reason:
      'Emergence of more cost-effective suppliers after the initial quotation request.',
  },
  {
    ruleDesignerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
    reason:
      'Changes in project specifications or quantities requiring revised quotations.',
  },
  {
    ruleDesignerId: '535df5f5-c24f-43f9-b655-874afc2eeee5',
    reason: 'Legal challenges or concerns regarding the RFQ process.',
  },
];

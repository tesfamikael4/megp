export const seedRules = [
  {
    designerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '30000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '30000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '482f2dba-24a5-4935-85aa-f8242f45ee76',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '500000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '30000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '482f2dba-24a5-4935-85aa-f8242f45ee76',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '482f2dba-24a5-4935-85aa-f8242f45ee76',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '5000000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '482f2dba-24a5-4935-85aa-f8242f45ee76',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '30000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'fbf7d46d-c617-49a2-8230-2d4f16566510',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '500000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'fbf7d46d-c617-49a2-8230-2d4f16566510',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '500000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'fbf7d46d-c617-49a2-8230-2d4f16566510',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '5000000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'd2e63f1c-f999-4348-b43d-974596f321c7',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '20000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '219537ed-a7dc-4d5a-900f-b6c08f466add',
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
          field: 'maxValueThreshold',
          operator: '<',
          value: '20000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'a6632650-8f09-490a-9fee-46dde7cee016',
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
          field: 'maxValueThreshold',
          operator: '<',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '20000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '75784bd4-e3fc-41e6-ad57-6c716c7ef6a4',
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
          field: 'maxValueThreshold',
          operator: '<',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '20000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'dcf9bfe0-f00e-4dfb-bd3c-363c03da8f20',
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
          field: 'maxValueThreshold',
          operator: '<',
          value: '10000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '2e905804-3a16-4e02-a804-a934a7175340',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '5e28678f-5428-4fb9-acfa-1f046f4e5205',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '5e28678f-5428-4fb9-acfa-1f046f4e5205',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '0',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '9c6cce80-bb69-43a9-b9f5-bac8214c2ad2',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '9c6cce80-bb69-43a9-b9f5-bac8214c2ad2',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '9c6cce80-bb69-43a9-b9f5-bac8214c2ad2',
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
          field: 'maxValueThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
        {
          field: 'minValueThreshold',
          operator: '>=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '40af4807-037b-4a15-996f-101481b8a6a3',
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
    designerId: '2573ba6e-0dea-48ce-a191-3899bc387bd6',
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
    id: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'National Competitive Bidding',
    key: 'nationalCompetitiveBidding',
    id: '482f2dba-24a5-4935-85aa-f8242f45ee76',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'International Competitive Bidding',
    key: 'internationalCompetitiveBidding',
    id: 'fbf7d46d-c617-49a2-8230-2d4f16566510',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Short listing',
    key: 'shortListing',
    id: 'd2e63f1c-f999-4348-b43d-974596f321c7',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Expression of Interest',
    key: 'expressionOfInterest',
    id: '219537ed-a7dc-4d5a-900f-b6c08f466add',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'NCB Expression of Interest',
    key: 'ncbExpressionOfInterest',
    id: 'a6632650-8f09-490a-9fee-46dde7cee016',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'ICB Expression of Interest',
    key: 'icbExpressionOfInterest',
    id: '75784bd4-e3fc-41e6-ad57-6c716c7ef6a4',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Single source',
    key: 'singleSource',
    id: 'dcf9bfe0-f00e-4dfb-bd3c-363c03da8f20',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Micro',
    key: 'micro',
    id: '2e905804-3a16-4e02-a804-a934a7175340',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Small',
    key: 'small',
    id: '5e28678f-5428-4fb9-acfa-1f046f4e5205',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Medium',
    key: 'medium',
    id: '9c6cce80-bb69-43a9-b9f5-bac8214c2ad2',
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
    id: '40af4807-037b-4a15-996f-101481b8a6a3',
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
    id: '2573ba6e-0dea-48ce-a191-3899bc387bd6',
  },
];
export const seedPossibleReasons = [
  {
    ruleDesignerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
    reason:
      'Adoption of new cost-effective technologies or materials that impact the quotation process.',
  },
  {
    ruleDesignerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
    reason: 'Changes in market dynamics affecting supplier pricing strategies.',
  },
  {
    ruleDesignerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
    reason:
      'Internal initiatives to streamline the procurement process for efficiency.',
  },
  {
    ruleDesignerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
    reason:
      'Emergence of more cost-effective suppliers after the initial quotation request.',
  },
  {
    ruleDesignerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
    reason:
      'Changes in project specifications or quantities requiring revised quotations.',
  },
  {
    ruleDesignerId: '8a9ba87c-df7b-497b-80a4-435a7f995c9c',
    reason: 'Legal challenges or concerns regarding the RFQ process.',
  },
];

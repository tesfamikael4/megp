export const seedRules = [
  {
    designerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
    key: 'ruleOne',
    executionOrder: 1,
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
    designerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
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
    designerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
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
    designerId: '7b5bdc8b-9046-4f0c-9477-94668a353c75',
    key: 'ruleFour',
    executionOrder: 1,
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
    designerId: '7b5bdc8b-9046-4f0c-9477-94668a353c75',
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
    designerId: '7b5bdc8b-9046-4f0c-9477-94668a353c75',
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
    designerId: '7b5bdc8b-9046-4f0c-9477-94668a353c75',
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
    designerId: '29fce1e7-8892-4f30-8149-80dcf38e1d1a',
    key: 'ruleEight',
    executionOrder: 1,
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
    designerId: '29fce1e7-8892-4f30-8149-80dcf38e1d1a',
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
    designerId: '29fce1e7-8892-4f30-8149-80dcf38e1d1a',
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
    designerId: '713edfc6-fa8f-4745-b88a-719361a6a323',
    key: 'ruleEleven',
    executionOrder: 1,
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
    designerId: 'b63cebb4-9372-4993-ae96-5b645da25474',
    key: 'ruleTwelve',
    executionOrder: 1,
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
    designerId: '67fb5e82-6885-4053-9b33-37fe2882ecc4',
    key: 'ruleThirteen',
    executionOrder: 1,
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
    designerId: 'c5541937-cecc-4070-a310-4df40ed390d5',
    key: 'ruleFourteen',
    executionOrder: 1,
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
    designerId: 'ff457a97-7198-4fcc-8711-81c0c02ee122',
    key: 'ruleFifteen',
    executionOrder: 1,
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
    designerId: '7d373d18-0ac5-4b7d-a92d-959bc350ce7f',
    key: 'ruleSixteen',
    executionOrder: 1,
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
    designerId: '090593ea-034f-4c78-b324-9530bfee66e4',
    key: 'ruleSeventeen',
    executionOrder: 1,
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
    designerId: '090593ea-034f-4c78-b324-9530bfee66e4',
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
    designerId: '727822d6-2bca-454e-b476-bb58968000e6',
    key: 'rule19',
    executionOrder: 1,
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
    designerId: '727822d6-2bca-454e-b476-bb58968000e6',
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
    designerId: '727822d6-2bca-454e-b476-bb58968000e6',
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
    designerId: '5ddf51a8-8229-4630-896e-269ee5f644ea',
    key: 'rule22',
    executionOrder: 1,
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
    designerId: '69332dd0-035e-4886-a284-b6ccdb990217',
    key: 'rule23',
    executionOrder: 1,
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
    actions: [{ type: 'validate' }],
    name: 'Request for quotation',
    key: 'requestForQuotation',
    id: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'National Competitive Bidding',
    key: 'nationalCompetitiveBidding',
    id: '7b5bdc8b-9046-4f0c-9477-94668a353c75',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'International Competitive Bidding',
    key: 'internationalCompetitiveBidding',
    id: '29fce1e7-8892-4f30-8149-80dcf38e1d1a',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'Short listing',
    key: 'shortListing',
    id: '713edfc6-fa8f-4745-b88a-719361a6a323',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'Expression of Interest',
    key: 'expressionOfInterest',
    id: 'b63cebb4-9372-4993-ae96-5b645da25474',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'NCB Expression of Interest',
    key: 'ncbExpressionOfInterest',
    id: '67fb5e82-6885-4053-9b33-37fe2882ecc4',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'ICB Expression of Interest',
    key: 'icbExpressionOfInterest',
    id: 'c5541937-cecc-4070-a310-4df40ed390d5',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'Single source',
    key: 'singleSource',
    id: 'ff457a97-7198-4fcc-8711-81c0c02ee122',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'Micro',
    key: 'micro',
    id: '7d373d18-0ac5-4b7d-a92d-959bc350ce7f',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'Small',
    key: 'small',
    id: '090593ea-034f-4c78-b324-9530bfee66e4',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    name: 'Medium',
    key: 'medium',
    id: '727822d6-2bca-454e-b476-bb58968000e6',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [
      { type: 'validate' },
      { type: 'set', name: 'recommend', value: ['comply', 'not comply'] },
    ],
    name: 'IBM Restriction Percentage',
    key: 'ibmRestrictionPercentage',
    id: '5ddf51a8-8229-4630-896e-269ee5f644ea',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [
      { type: 'validate' },
      { type: 'set', name: 'recommend', value: ['comply', 'not comply'] },
    ],
    name: 'RFQ Restriction',
    key: 'rfqRestriction',
    id: '69332dd0-035e-4886-a284-b6ccdb990217',
  },
];
export const seedPossibleReasons = [
  {
    ruleDesignerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
    reason:
      'Adoption of new cost-effective technologies or materials that impact the quotation process.',
  },
  {
    ruleDesignerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
    reason: 'Changes in market dynamics affecting supplier pricing strategies.',
  },
  {
    ruleDesignerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
    reason:
      'Internal initiatives to streamline the procurement process for efficiency.',
  },
  {
    ruleDesignerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
    reason:
      'Emergence of more cost-effective suppliers after the initial quotation request.',
  },
  {
    ruleDesignerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
    reason:
      'Changes in project specifications or quantities requiring revised quotations.',
  },
  {
    ruleDesignerId: '1ada4caa-00a6-4886-aaf2-40d7270ceed2',
    reason: 'Legal challenges or concerns regarding the RFQ process.',
  },
  {
    ruleDesignerId: '713edfc6-fa8f-4745-b88a-719361a6a323',
    reason:
      'Introduction of new technology or methodologies that require expertise from a broader range of suppliers.',
  },
  {
    ruleDesignerId: '713edfc6-fa8f-4745-b88a-719361a6a323',
    reason:
      'Changes in government policies or regulations affecting supplier selection criteria.',
  },
  {
    ruleDesignerId: '713edfc6-fa8f-4745-b88a-719361a6a323',
    reason:
      'Internal organizational changes impacting the composition of the supplier pool.',
  },
  {
    ruleDesignerId: '713edfc6-fa8f-4745-b88a-719361a6a323',
    reason:
      'Identification of additional qualified suppliers after the initial selection.',
  },
  {
    ruleDesignerId: '713edfc6-fa8f-4745-b88a-719361a6a323',
    reason:
      'Changes in project requirements necessitating a broader pool of suppliers.',
  },
  {
    ruleDesignerId: '713edfc6-fa8f-4745-b88a-719361a6a323',
    reason: 'Legal challenges or concerns regarding the selectivity criteria.',
  },
  {
    ruleDesignerId: 'ff457a97-7198-4fcc-8711-81c0c02ee122',
    reason:
      'Changes in supplier capacity or reliability affecting the single-source decision.',
  },
  {
    ruleDesignerId: 'ff457a97-7198-4fcc-8711-81c0c02ee122',
    reason:
      "Shift in the organization's risk tolerance or risk management approach.",
  },
  {
    ruleDesignerId: 'ff457a97-7198-4fcc-8711-81c0c02ee122',
    reason:
      'External pressures or legal challenges prompting a reevaluation of the direct procurement method.',
  },
  {
    ruleDesignerId: 'ff457a97-7198-4fcc-8711-81c0c02ee122',
    reason:
      'Identification of additional qualified suppliers after the initial decision.',
  },
  {
    ruleDesignerId: 'ff457a97-7198-4fcc-8711-81c0c02ee122',
    reason:
      'Changes in project scope or specifications requiring a new procurement approach.',
  },
  {
    ruleDesignerId: 'ff457a97-7198-4fcc-8711-81c0c02ee122',
    reason:
      'Legal challenges or concerns regarding the direct procurement decision.',
  },
];

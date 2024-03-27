export const seedRules = [
  {
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
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
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
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
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
    key: 'ruleThree',
    executionOrder: 3,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'nonConsultancy',
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
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
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
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
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
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
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
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
    key: 'ruleSeven',
    executionOrder: 4,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'nonConsultancy',
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
    designerId: '6da7a403-6340-4662-a191-a7ead93157a9',
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
    designerId: '6da7a403-6340-4662-a191-a7ead93157a9',
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
    designerId: '6da7a403-6340-4662-a191-a7ead93157a9',
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
    designerId: 'a272a6d4-de9e-4dd8-983b-99d3b4c4c817',
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
    designerId: '7499546a-8d8c-4530-9f14-410c3d3410bc',
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
    designerId: '5d9f6a26-6326-430d-9f78-e6b6b5c6d2fd',
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
    designerId: '7a2c9e29-07bb-405f-8b1b-0b6aaa89c023',
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
    designerId: '1968aae7-805b-445e-afac-5ebe192e7170',
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
    designerId: '67722b59-af3b-45b5-8589-343dffb10ba3',
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
    designerId: '89df3826-f05e-4ffc-a9cd-4cd214f72935',
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
    designerId: '89df3826-f05e-4ffc-a9cd-4cd214f72935',
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
    designerId: '89df3826-f05e-4ffc-a9cd-4cd214f72935',
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
    designerId: '8529bd51-7c21-44bb-b0f7-47ed73e17259',
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
    designerId: '8529bd51-7c21-44bb-b0f7-47ed73e17259',
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
    designerId: '83963975-7c1e-41ef-a6ed-a875af102947',
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
    designerId: '5462e760-2f47-44f7-9097-475aaac2d356',
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
          value: 'ibm',
          type: 'string',
          joinType: '||',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'marginalizedGroup',
          type: 'string',
          joinType: '||',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'micro',
          type: 'string',
          joinType: '||',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'small',
          type: 'string',
          joinType: '||',
        },
        {
          field: 'preferentialGroup',
          operator: '<=',
          value: 'medium',
          type: 'string',
          joinType: '||',
        },
      ],
    ],
  },
  {
    designerId: 'f51006e5-5ad8-4548-8b63-de809cc57d4c',
    key: 'rule24',
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
          field: 'procurementMethod',
          operator: '==',
          value: 'rfq',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'f51006e5-5ad8-4548-8b63-de809cc57d4c',
    key: 'rule25',
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
          field: 'procurementMethod',
          operator: '==',
          value: 'rfq',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '<=',
          value: '150000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'f51006e5-5ad8-4548-8b63-de809cc57d4c',
    key: 'rule26',
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
          field: 'procurementMethod',
          operator: '==',
          value: 'shortlistingIndividual',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '<=',
          value: '50000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'f51006e5-5ad8-4548-8b63-de809cc57d4c',
    key: 'rule27',
    executionOrder: 4,
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
          field: 'procurementMethod',
          operator: '==',
          value: 'shortlistingFirm',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'f51006e5-5ad8-4548-8b63-de809cc57d4c',
    key: 'rule28',
    executionOrder: 5,
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
          field: 'procurementMethod',
          operator: '==',
          value: 'rfq',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '<=',
          value: '100000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'f51006e5-5ad8-4548-8b63-de809cc57d4c',
    key: 'rule29',
    executionOrder: 6,
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'motorVehicleService',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'procurementMethod',
          operator: '==',
          value: 'rfq',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '<=',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: 'f51006e5-5ad8-4548-8b63-de809cc57d4c',
    key: 'rule30',
    executionOrder: 7,
    conditions: [
      [
        {
          field: 'procurementMethod',
          operator: '==',
          value: 'singleSource',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '<=',
          value: '10000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '0b4acce9-b0ac-4dab-b98a-88144ee08187',
    key: 'rule31',
    executionOrder: 1,
    enforcementMethod: 'FLAG',
    conditions: [
      [
        {
          field: 'procurementCategory',
          operator: '==',
          value: 'motorVehicleService',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'procurementMethod',
          operator: '==',
          value: 'rfq',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '>',
          value: '5000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '0b4acce9-b0ac-4dab-b98a-88144ee08187',
    key: 'rule32',
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
          field: 'procurementMethod',
          operator: '==',
          value: 'eoi',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '>',
          value: '1000000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '0b4acce9-b0ac-4dab-b98a-88144ee08187',
    key: 'rule33',
    executionOrder: 3,
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
          field: 'maxThreshold',
          operator: '>',
          value: '1500000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '0b4acce9-b0ac-4dab-b98a-88144ee08187',
    key: 'rule34',
    executionOrder: 4,
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
          field: 'maxThreshold',
          operator: '>',
          value: '3500000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '0b4acce9-b0ac-4dab-b98a-88144ee08187',
    key: 'rule35',
    executionOrder: 6,
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
          field: 'maxThreshold',
          operator: '>',
          value: '1500000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '21cd9b1e-4f22-4a37-97a3-901781a04832',
    key: 'rule36',
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
          field: 'maxThreshold',
          operator: '>',
          value: '1500000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '21cd9b1e-4f22-4a37-97a3-901781a04832',
    key: 'rule37',
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
          field: 'maxThreshold',
          operator: '>',
          value: '3500000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '21cd9b1e-4f22-4a37-97a3-901781a04832',
    key: 'rule38',
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
          field: 'maxThreshold',
          operator: '>',
          value: '1500000000',
          type: 'integer',
          joinType: '&&',
        },
      ],
    ],
  },
  {
    designerId: '21cd9b1e-4f22-4a37-97a3-901781a04832',
    key: 'rule39',
    executionOrder: 4,
    conditions: [
      [
        {
          field: 'procurementMethod',
          operator: '==',
          value: 'singleSource',
          type: 'string',
          joinType: '&&',
        },
        {
          field: 'maxThreshold',
          operator: '>',
          value: '10000',
          type: 'integer',
          joinType: '&&',
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
    id: '2f15cab9-e275-4a0e-8b39-149713b47de4',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'National Competitive Bidding',
    key: 'nationalCompetitiveBidding',
    id: '46f766c3-5d16-4472-81c2-d31c45279878',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'International Competitive Bidding',
    key: 'internationalCompetitiveBidding',
    id: '6da7a403-6340-4662-a191-a7ead93157a9',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Short listing',
    key: 'shortListing',
    id: 'a272a6d4-de9e-4dd8-983b-99d3b4c4c817',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Expression of Interest',
    key: 'expressionOfInterest',
    id: '7499546a-8d8c-4530-9f14-410c3d3410bc',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'NCB Expression of Interest',
    key: 'ncbExpressionOfInterest',
    id: '5d9f6a26-6326-430d-9f78-e6b6b5c6d2fd',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'ICB Expression of Interest',
    key: 'icbExpressionOfInterest',
    id: '7a2c9e29-07bb-405f-8b1b-0b6aaa89c023',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Single source',
    key: 'singleSource',
    id: '1968aae7-805b-445e-afac-5ebe192e7170',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Micro',
    key: 'micro',
    id: '67722b59-af3b-45b5-8589-343dffb10ba3',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Small',
    key: 'small',
    id: '89df3826-f05e-4ffc-a9cd-4cd214f72935',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    name: 'Medium',
    key: 'medium',
    id: '8529bd51-7c21-44bb-b0f7-47ed73e17259',
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
    id: '83963975-7c1e-41ef-a6ed-a875af102947',
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
    id: '5462e760-2f47-44f7-9097-475aaac2d356',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [],
    name: 'IPDC Approval',
    key: 'ipdcApproval',
    id: 'f51006e5-5ad8-4548-8b63-de809cc57d4c',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [],
    name: 'PPDA Approval',
    key: 'ppdaApproval',
    id: '0b4acce9-b0ac-4dab-b98a-88144ee08187',
  },
  {
    enforcementMethod: 'FLAG',
    actions: [{ type: 'validate' }],
    defaultActions: [],
    name: 'Anti Corruption Review',
    key: 'antiCorruptionReview',
    id: '21cd9b1e-4f22-4a37-97a3-901781a04832',
  },
];
export const seedPossibleReasons = [
  {
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
    reason:
      'Adoption of new cost-effective technologies or materials that impact the quotation process.',
  },
  {
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
    reason: 'Changes in market dynamics affecting supplier pricing strategies.',
  },
  {
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
    reason:
      'Internal initiatives to streamline the procurement process for efficiency.',
  },
  {
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
    reason:
      'Emergence of more cost-effective suppliers after the initial quotation request.',
  },
  {
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
    reason:
      'Changes in project specifications or quantities requiring revised quotations.',
  },
  {
    designerId: '2f15cab9-e275-4a0e-8b39-149713b47de4',
    reason: 'Legal challenges or concerns regarding the RFQ process.',
  },
  {
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
    reason:
      'Change in supplier availability due to unforeseen events (e.g., natural disasters, economic crises).',
  },
  {
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
    reason:
      'Changes in project financing necessitating a reevaluation of procurement strategies.',
  },
  {
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
    reason:
      'Legal challenges or concerns regarding the open tendering process.',
  },
  {
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
    reason: 'Change in market conditions, leading to a lack of competition.',
  },
  {
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
    reason:
      'Emergence of new, more qualified suppliers after the initial tender announcement.',
  },
  {
    designerId: '46f766c3-5d16-4472-81c2-d31c45279878',
    reason: 'Unexpected changes in project scope or specifications.',
  },
  {
    designerId: 'a272a6d4-de9e-4dd8-983b-99d3b4c4c817',
    reason:
      'Introduction of new technology or methodologies that require expertise from a broader range of suppliers.',
  },
  {
    designerId: 'a272a6d4-de9e-4dd8-983b-99d3b4c4c817',
    reason:
      'Changes in government policies or regulations affecting supplier selection criteria.',
  },
  {
    designerId: 'a272a6d4-de9e-4dd8-983b-99d3b4c4c817',
    reason:
      'Internal organizational changes impacting the composition of the supplier pool.',
  },
  {
    designerId: 'a272a6d4-de9e-4dd8-983b-99d3b4c4c817',
    reason:
      'Identification of additional qualified suppliers after the initial selection.',
  },
  {
    designerId: 'a272a6d4-de9e-4dd8-983b-99d3b4c4c817',
    reason:
      'Changes in project requirements necessitating a broader pool of suppliers.',
  },
  {
    designerId: 'a272a6d4-de9e-4dd8-983b-99d3b4c4c817',
    reason: 'Legal challenges or concerns regarding the selectivity criteria.',
  },
  {
    designerId: '7499546a-8d8c-4530-9f14-410c3d3410bc',
    reason:
      'Emergence of innovative solutions or technologies that prompt a reassessment of proposal requirements.',
  },
  {
    designerId: '7499546a-8d8c-4530-9f14-410c3d3410bc',
    reason:
      'Changes in project stakeholders or decision-makers necessitating a reevaluation of criteria.',
  },
  {
    designerId: '7499546a-8d8c-4530-9f14-410c3d3410bc',
    reason:
      'Internal capacity-building initiatives requiring a more detailed proposal review.',
  },
  {
    designerId: '7499546a-8d8c-4530-9f14-410c3d3410bc',
    reason:
      'Need for a more detailed proposal evaluation due to project complexity.',
  },
  {
    designerId: '7499546a-8d8c-4530-9f14-410c3d3410bc',
    reason:
      'Changes in project scope or requirements that necessitate a new proposal.',
  },
  {
    designerId: '7499546a-8d8c-4530-9f14-410c3d3410bc',
    reason: 'Legal challenges or concerns regarding the RFP process.',
  },
  {
    designerId: '1968aae7-805b-445e-afac-5ebe192e7170',
    reason:
      'Changes in supplier capacity or reliability affecting the single-source decision.',
  },
  {
    designerId: '1968aae7-805b-445e-afac-5ebe192e7170',
    reason:
      "Shift in the organization's risk tolerance or risk management approach.",
  },
  {
    designerId: '1968aae7-805b-445e-afac-5ebe192e7170',
    reason:
      'External pressures or legal challenges prompting a reevaluation of the direct procurement method.',
  },
  {
    designerId: '1968aae7-805b-445e-afac-5ebe192e7170',
    reason:
      'Identification of additional qualified suppliers after the initial decision.',
  },
  {
    designerId: '1968aae7-805b-445e-afac-5ebe192e7170',
    reason:
      'Changes in project scope or specifications requiring a new procurement approach.',
  },
  {
    designerId: '1968aae7-805b-445e-afac-5ebe192e7170',
    reason:
      'Legal challenges or concerns regarding the direct procurement decision.',
  },
];

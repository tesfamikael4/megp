const seedDesigns = [
  {
    name: 'Request for quotation',
    key: 'requestForQuotation',
    rules: [
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
    ],
    actions: [
      { type: 'validate' },
      { type: 'set', name: 'sth', value: 'value' },
    ],
    defaultActions: [{ type: 'set', name: 'default', value: true }],
    possibleReasons: [{ reason: '' }],
  },
];

export const seedRuleHandlers = [
  {
    id: '5157151c-244d-49dd-83dc-c599493dc9f9',
    application: 'planning',
    key: 'budget',
    name: 'Budget',
    type: 'CONDITION',
  },
  {
    id: 'cfa1de54-8448-4972-8c0a-13b0ec9811f1',
    application: 'planning',
    key: 'procurementCategory',
    name: 'Procurement Category',
    type: 'CONDITION',
  },
  {
    id: 'b754327a-c938-4f7c-8ba7-78f100e4d1b4',
    application: 'planning',
    key: 'preferentialGroup',
    name: 'Preferential Group',
    type: 'ACTION',
  },
  {
    id: '9bf9a0b8-fe8e-432c-82cb-fa288ca82e93',
    application: 'planning',
    key: 'procurmentMethod',
    name: 'Procurment Method',
    type: 'ACTION',
  },
];

export const seedRuleHandlerOptions = [
  {
    key: 'maximumThreshold',
    type: 'input',
    dataType: 'integer',
    name: 'Maximum Threshold',
    ruleHandlerId: '5157151c-244d-49dd-83dc-c599493dc9f9',
  },
  {
    key: 'minimumThreshold',
    type: 'input',
    dataType: 'integer',
    name: 'Minimum Threshold',
    ruleHandlerId: '5157151c-244d-49dd-83dc-c599493dc9f9',
  },
  {
    key: 'preferentialGroups',
    type: 'select',
    value: ['IBM', 'Marginalized Group', 'Micro', 'Small', 'Medium'],
    name: 'Preferential Group',
    ruleHandlerId: 'b754327a-c938-4f7c-8ba7-78f100e4d1b4',
  },
  {
    key: 'procurementCategories',
    type: 'select',
    value: ['Goods', 'Works', 'Services', 'Consultancy'],
    name: 'Procurement Categories',
    ruleHandlerId: 'cfa1de54-8448-4972-8c0a-13b0ec9811f1',
  },
  {
    key: 'procurementMethods',
    type: 'select',
    value: [
      'Request for Quotation',
      'NCB',
      'ICB',
      'Restricted Tender',
      'Single Sourcing',
      'Request for Proposal',
      'Two-stage Bidding',
      'Framework Procurement',
      'Purchase Order ',
    ],
    name: 'Procurement Methods',
    ruleHandlerId: '9bf9a0b8-fe8e-432c-82cb-fa288ca82e93',
  },
];

export const reformattedSchema = {
  type: 'object',
  properties: {
    size: {
      type: 'number',
      minimum: 30,
      maximum: 50,
    },
    color: {
      type: 'string',
      enum: ['black', 'red', 'yellow'],
    },
    brand: {
      type: 'string',
      description: 'Enter the brand name',
    },
    model: {
      type: 'string',
      description: 'Enter the model name',
    },
    price: {
      type: 'number',
      description: 'Enter the price',
    },
    processor: {
      type: 'string',
      description: 'Enter the processor',
    },
    RAM: {
      type: 'string',
      description: 'Enter the RAM',
    },
    storageType: {
      type: 'string',
      description: 'Enter the storage type',
    },
    storageCapacity: {
      type: 'string',
      description: 'Enter the storage capacity',
    },
    connectivity: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['Wi-Fi', 'Bluetooth', 'Ethernet', 'USB', 'HDMI', 'Thunderbolt'],
      },
    },
  },
};

export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/size',
        },
        {
          type: 'Control',
          scope: '#/properties/color',
        },
        {
          type: 'Control',
          scope: '#/properties/brand',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/model',
        },
        {
          type: 'Control',
          scope: '#/properties/price',
        },
        {
          type: 'Control',
          scope: '#/properties/processor',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/RAM',
        },
        {
          type: 'Control',
          scope: '#/properties/storageType',
        },
        {
          type: 'Control',
          scope: '#/properties/storageCapacity',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/connectivity',
        },
      ],
    },
  ],
};
const schema = {
  itemCode: '000:000:000:000:computer',
  categories: {
    basic: {
      size: {
        type: 'number',
        validation: {
          minValue: 30,
          maxValue: 50,
        },
      },
      color: {
        type: 'list',
        values: ['black', 'red', 'yellow'],
      },
    },
  },
  additionalCategories: {
    brand: {
      type: 'string',
    },
    model: {
      type: 'string',
    },
    price: {
      type: 'number',
    },
    processor: {
      type: 'string',
    },
    RAM: {
      type: 'string',
    },
    storageType: {
      type: 'string',
    },
    storageCapacity: {
      type: 'string',
    },
    connectivity: {
      type: 'list',
      values: ['Wi-Fi', 'Bluetooth', 'Ethernet', 'USB', 'HDMI', 'Thunderbolt'],
    },
    batteryLife: {
      type: 'string',
    },
    warranty: {
      type: 'string',
    },
  },
};

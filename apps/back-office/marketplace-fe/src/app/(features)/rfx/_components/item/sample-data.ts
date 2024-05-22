import { string } from 'zod';

export const Data: any = {
  id: '117df3c0-ca45-4bee-8509-98b6660d7dd2',
  itemMasterId: '4d75f35a-bddb-47a1-8d96-685d2b78597b',
  quantity: '10.00',

  properties: [
    {
      key: 'a4bb6f55-a9a5-4812-8a96-daa313f9e4',
      // : 'a4bb6f55-a9a5-4812-8a96-daa313f9e43',
      category: 'Basic specification',
      dataType: 'number',
      validation: {
        isRequired: true,
        type: 'number',
        min: 1,
        max: 2,
      },
      displayName: 'size',
      measurement: 'm',
    },
    {
      key: 'a4bb6f55-a9a5-4812-8a96-daa313f9e45',
      // : V4(),
      category: 'Basic specification',
      dataType: 'string',
      displayName: 'color',
      measurement: 'm',
      validation: {
        isRequired: true,
        type: 'singleSelect',
        min: 1,
        max: 2,
        enum: ['black', 'red', 'yellow'],
      },
    },
    {
      key: 'a4bb6f55-a9a5-4812-8a96-daa313f9e',
      // : V4(),
      category: 'Basic specification',
      dataType: 'string',
      displayName: 'model',
      // measurement: '',
      validation: {
        isRequired: true,
        type: 'string',
        min: 1,
        max: 10,
      },
    },
    {
      key: 'a4bb6f55-a9a5-4812-8a96-daa313f9e46',
      // : V4(),
      category: 'Basic specification',
      dataType: 'string',
      displayName: 'connectiveity',
      // measurement: '',
      validation: {
        // isRequired: true,
        type: 'singleSelect',

        enum: ['Wi-Fi', 'Bluetooth', 'Ethernet', 'USB', 'HDMI', 'Thunderbolt'],
      },
    },
    // {
    //     key: 'a4bb6f55-a9a5-4812-8a96-daa313f9e47',
    //     // : V4(),
    //     category: 'Basic specification',
    //     displayName: 'others',
    //     dataType: 'string',
    //     // measurement: '',
    //     validation: {
    //         isRequired: false,
    //         type: 'multipleSelect',

    //         enum: ['jgvfk', 'hgjh', 'settykjl', 'jkb', 'jhb', 'kjn'],
    //     },
    // },
    // {
    //     displayName: 'others',
    //     dataType: 'string',
    //     key: 'a4bb6f55-a9a5-4812-8a96-daa313f9e48',

    //     validation: {
    //         isRequired: false,
    //         type: 'multiSelect',

    //         enum: ['jgvfk', 'hgjh', 'settykjl', 'jkb', 'jhb', 'kjn'],
    //     },
    // },
    {
      displayName: 'isFine',
      dataType: 'boolean',
      key: 'a4bb6f55-a9a5-4812-8a96-daa313f9e4',

      validation: {
        isRequired: true,
        type: 'checkbox',
      },
    },
  ],
};

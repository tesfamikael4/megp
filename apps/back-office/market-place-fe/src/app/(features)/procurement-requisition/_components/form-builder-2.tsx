'use client';
import { person } from '@jsonforms/examples';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { logger } from '@megp/core-fe';
import { useState } from 'react';
import { reformattedSchema, uiSchema } from './template';

// const schema = person.schema;
// const uischema = person.uischema;
// const initialData = person.data;

const initialData = {
  RAM: '16GB DDR4',
  size: 40,
  brand: 'ExampleBrand1',
  color: 'black',
  model: 'ExampleModel1',
  price: 1200,
  weight: 2.1,
  warranty: '1 year',
  processor: 'Intel Core i7-10700',
  resolution: '1920x1080 (Full HD)',
  batteryLife: 'Up to 8 hours',
  displaySize: '15.6 inches',
  storageType: 'SSD',
  connectivity: ['Wi-Fi', 'Bluetooth', 'Ethernet', 'USB'],
  graphicsCard: 'NVIDIA GeForce RTX 3060',
  operatingSystem: 'Windows 10',
  storageCapacity: '512GB',
};

export default function FormBuilder2() {
  const [data, setData] = useState(initialData);

  logger.log(data);
  return (
    <div className="App">
      <JsonForms
        schema={reformattedSchema}
        uischema={uiSchema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => setData(data)}
      />
    </div>
  );
}

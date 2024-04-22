import { UITypes } from 'react-hook-form-jsonschema';

export const personSchema = {
  $id: 'https://example.com/person.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Person',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      description: "The person's first name.",
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      description: "The person's last name.",
      title: 'Last Name',
    },
    middleName: {
      type: 'string',
      description: "The person's middle name.",
      title: 'Middle Name',
    },
    personType: {
      type: 'string',
      description: "The person's last name.",
      title: 'Type',
      enum: ['adult', 'child', 'senior citizen'],
    },
    kind: {
      type: 'string',
      title: 'Select',
      enum: ['adult', 'child', 'senior citizen'],
    },
    // birthYear: {
    //     description: "The person's birth year.",
    //     type: "integer",
    //     minimum: 1930,
    //     maximum: 2010,
    //     title: "Birth Year"
    // }
  },
};

export const UISchema = {
  type: UITypes.default,
  properties: {
    // birthYear: {
    //     type: UITypes.select
    // },
    kind: {
      type: UITypes.select,
    },
    personType: {
      type: UITypes.checkbox,
    },
  },
};

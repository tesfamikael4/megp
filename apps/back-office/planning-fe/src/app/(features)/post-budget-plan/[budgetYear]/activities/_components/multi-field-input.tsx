import {
  Center,
  Divider,
  Flex,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { ReactNode, useEffect, useState } from 'react';

interface MultiFieldInputProps {
  filed1Label: string;
  field2Label: string;
  value: any;
  withAsterisk?: boolean;
  error?: string | undefined;
  onChange: (data: any) => void;
}

export const MultiFieldInput = ({
  filed1Label,
  field2Label,
  value,
  onChange,
  error,
  withAsterisk = false,
}: MultiFieldInputProps): ReactNode => {
  const [inputFields, setInputFields] = useState([{ field1: '', field2: '' }]);

  const handleAddInput = () => {
    const newInputFields = [...inputFields, { field1: '', field2: '' }];
    setInputFields(newInputFields);
  };

  const handleInputChange = (index, event, fieldName) => {
    const values = [...inputFields];
    values[index][fieldName] = event.target.value;
    setInputFields(values);
  };

  const handleDeleteInput = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  useEffect(() => {
    const mappedObject = inputFields.reduce((acc, curr) => {
      if (curr.field1) {
        acc[curr.field1] = curr.field2;
      }
      return acc;
    }, {});
    onChange(mappedObject);
  }, [inputFields, onChange]);

  useEffect(() => {
    const convertedArray = Object.entries(value).map(([key, value]) => ({
      field1: key,
      field2: value,
    }));
    convertedArray.length == 0
      ? setInputFields([{ field1: '', field2: '' }])
      : setInputFields(convertedArray as []);
  }, []);

  return (
    <>
      <Divider label={filed1Label} labelPosition="left" />
      {inputFields.map((input, index) => (
        <Flex key={index} gap="md" align="end">
          <TextInput
            label={index === 0 ? filed1Label : null}
            withAsterisk={index === 0 && withAsterisk}
            className="w-full"
            value={input.field1}
            onChange={(e) => handleInputChange(index, e, 'field1')}
            required
            error={index === inputFields.length - 1 && error}
          />
          <TextInput
            label={index === 0 ? field2Label : null}
            withAsterisk={index === 0 && withAsterisk}
            className="w-full"
            value={input.field2}
            onChange={(e) => handleInputChange(index, e, 'field2')}
            disabled={!input.field1}
            required
            error={index === inputFields.length - 1 && error}
          />

          {inputFields.length != 1 && (
            <IconTrash
              className="text-slate-500 cursor-pointer "
              size={40}
              onClick={() => handleDeleteInput(index)}
            />
          )}
        </Flex>
      ))}
      <Flex justify="end">
        <IconPlus size={20} className="text-slate-500" />
        <Text
          className="text-sm font-semibold cursor-pointer text-slate-500 "
          onClick={handleAddInput}
        >
          Add
        </Text>
      </Flex>
    </>
  );
};

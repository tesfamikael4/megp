import { Dispatch, SetStateAction } from 'react';
import { MultiSelectInput } from './multi-select-input';
import { Expression } from '@/models/expressions';

export interface ExpressionBuilderProps {
  expressions: Expression[];
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>;
}

const operators = [
  {
    value: '+',
    label: '+',
  },
  {
    value: '-',
    label: '-',
  },
  {
    value: '*',
    label: '*',
  },
  {
    value: '(',
    label: '(',
  },
  {
    value: ')',
    label: ')',
  },
];

export const ExpressionBuilder = ({
  expressions,
  value,
  setValue,
}: ExpressionBuilderProps) => {
  const options = [
    ...operators,
    ...expressions.map((e) => ({ value: e.id, label: e.name })),
  ];

  const dataBuilder = (value: string) => {
    if (Number(value) && !'+-'.includes(value[0])) {
      return [{ value: value, label: value }];
    }

    return options;
  };

  return (
    <div>
      <span className="text-sm">
        Formula <span className="text-red-500">*</span>
      </span>
      <MultiSelectInput
        value={value}
        setValue={setValue}
        dataBuilder={dataBuilder}
        placeholder="Formula"
      />
    </div>
  );
};

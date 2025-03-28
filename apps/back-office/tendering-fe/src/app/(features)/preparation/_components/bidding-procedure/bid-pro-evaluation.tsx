import { ITenderEvaluation } from '@/models/tender/bid-procedures/evaluation.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/bid-evaluations.api';
import { useParams } from 'next/navigation';
import { useListQuery } from '../../_api/scc/curencies.api';

const SelectionMethodEnum = [
  {
    label: 'Least Cost-based Selection ',
    value: 'LCS',
  },
  {
    label: 'Quality and Cost-based Selection ',
    value: 'QCBS',
  },
  {
    label: 'Quality Based Selection',
    value: 'QBS',
  },
  {
    label: 'Fixed Budget-based Selection ',
    value: 'FBS',
  },
  {
    label: 'Consultant’s Qualification-based Selection',
    value: 'CQS',
  },
  {
    label: 'Direct Selection or Single source selection',
    value: 'SSS',
  },
  {
    label: 'Least Price Selection',
    value: 'LPS',
  },
];

export default function BidProEvaluation() {
  const { id } = useParams();
  const [technicalRequired, setTechnicalRequired] = useState<boolean>(false);
  const [financialRequired, setFinancialRequired] = useState<boolean>(false);
  const [passingMarkRequired, setPassingMarkRequired] =
    useState<boolean>(false);
  const EvaluationSchema: ZodType<Partial<ITenderEvaluation>> = z.object({
    bidEvaluationCurrency: z.array(
      z.string({
        required_error: 'Evaluation Currency is required',
      }),
    ),
    evaluationMethod: z.enum(['point system', 'compliance']),
    selectionMethod: z.enum(['LCS', 'QCBS', 'QBS', 'FBS', 'CQS', 'SSS', 'LPS']),
    awardType: z.enum(['item based', 'lot based']),
    technicalWeight: z.number().optional(),
    financialWeight: z.number().optional(),
    passingMark: z.number().optional(),
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: zodResolver(EvaluationSchema),
  });

  const method = watch('evaluationMethod');
  const technical = watch('technicalWeight');
  const finance = watch('financialWeight');
  const passing = watch('passingMark');
  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());
  const { data: currencies } = useListQuery({
    skip: 0,
    take: 300,
  });
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    logger.log(technical, finance, passing);
    if (
      method === 'point system' &&
      (!technical ||
        !finance ||
        !passing ||
        technical < 0 ||
        finance < 0 ||
        passing < 0 ||
        technical > 100 ||
        finance > 100 ||
        passing > 100)
    ) {
      setFinancialRequired(!finance || finance < 0 || finance > 100);
      setPassingMarkRequired(!passing || passing < 0 || passing > 100);
      setTechnicalRequired(!technical || technical < 0 || technical > 100);
      return;
    } else {
      setFinancialRequired(false);
      setPassingMarkRequired(false);
      setTechnicalRequired(false);

      await create({
        ...data,
        tenderId: id,
      })
        .unwrap()
        .then(() => {
          notify('Success', 'Bid Procurement General created successfully');
        })
        .catch(() => {
          notify('Error', 'Error in creating bid procurement general');
        });
    }
  };

  const onUpdate = async (data) => {
    await update({
      ...data,
      tenderId: id,
      id: id?.toString(),
    })
      .unwrap()
      .then(() => {
        notify('Success', 'Bid Procurement General updated successfully');
      })
      .catch(() => {
        notify('Error', 'Error in updating bid procurement general');
      });
  };

  useEffect(() => {
    if (isSuccess && selected) {
      reset({
        bidEvaluationCurrency: selected.bidEvaluationCurrency,
        evaluationMethod: selected.evaluationMethod,
        selectionMethod: selected.selectionMethod,
        awardType: selected.awardType,
        technicalWeight: selected.technicalWeight,
        financialWeight: selected.financialWeight,
        passingMark: selected.passingMark,
      });
    }
  }, [reset, selected, isSuccess]);

  useEffect(() => {
    if (technical) {
      const value = 100 - technical;
      setValue('financialWeight', value);
    }
  }, [setValue, technical]);

  useEffect(() => {
    if (method === 'compliance') {
      setValue('financialWeight', 0);
      setValue('technicalWeight', 0);
      setValue('passingMark', 0);
    }
  }, [setValue, method]);

  useEffect(() => {
    logger.log(errors);
  }, [errors]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="w-full flex space-x-4">
        <Controller
          name="bidEvaluationCurrency"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <MultiSelect
              placeholder="Select Bid Evaluation Currency"
              name={name}
              value={value}
              withAsterisk
              onChange={onChange}
              className="w-1/2"
              label="Bid Evaluation Currency"
              data={
                currencies && currencies.items.length > 0
                  ? currencies.items.map((item: any) => {
                      const value = { ...item };
                      (value['value'] = item.abbreviation),
                        (value['label'] = item.name);
                      return value;
                    })
                  : []
              }
              searchable
              clearable
              error={
                errors.bidEvaluationCurrency?.message as string | undefined
              }
            />
          )}
        />
        <Controller
          control={control}
          name="evaluationMethod"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={['point system', 'compliance']}
              error={
                errors['evaluationMethod']
                  ? errors['evaluationMethod']?.message?.toString()
                  : ''
              }
              label="Evaluation Method"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Evaluation Method"
              searchable
              value={value}
            />
          )}
        />
      </div>
      <div className="flex gap-3">
        <Controller
          control={control}
          name="selectionMethod"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={SelectionMethodEnum}
              error={
                errors['selectionMethod']
                  ? errors['selectionMethod']?.message?.toString()
                  : ''
              }
              label="Selection Method"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Selection Method"
              searchable
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="awardType"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={['item based', 'lot based']}
              error={
                errors['awardType']
                  ? errors['awardType']?.message?.toString()
                  : ''
              }
              label="Award Type"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Award Type"
              searchable
              value={value}
            />
          )}
        />
      </div>
      <div className="w-full flex gap-3">
        <div className="w-1/2">
          <Controller
            name="technicalWeight"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                label="Technical Weight"
                name={name}
                value={value}
                disabled={method === 'compliance'}
                min={0}
                max={100}
                className="w-full"
                onChange={(d) => onChange(parseInt(d as string))}
                error={
                  errors['technicalWeight'] || technicalRequired
                    ? errors['technicalWeight']?.message?.toString()
                    : ''
                }
                withAsterisk
              />
            )}
          />
          {technicalRequired && !technical && (
            <Text size="sm" className="text-red-500">
              {' '}
              Technical weight is required and must be above zero{' '}
            </Text>
          )}
        </div>
        <div className="w-1/2">
          <Controller
            name="financialWeight"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                label="Financial Weight"
                name={name}
                value={value}
                min={0}
                disabled={method === 'compliance'}
                className="w-full"
                onChange={(d) => onChange(parseInt(d as string))}
                error={
                  errors['financialWeight'] || financialRequired
                    ? errors['financialWeight']?.message?.toString()
                    : ''
                }
                withAsterisk
              />
            )}
          />
          {financialRequired && !finance && (
            <Text size="sm" className="text-red-500">
              {' '}
              Financial weight is required and must be above zero{' '}
            </Text>
          )}
        </div>
      </div>
      <div className="gap-3">
        <Controller
          name="passingMark"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Passing Mark"
              name={name}
              min={1}
              value={value}
              disabled={method === 'compliance'}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['passingMark'] || passingMarkRequired
                  ? errors['passingMark']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />
        {passingMarkRequired && !passing && (
          <Text size="sm" className="text-red-500">
            {' '}
            Passing Mark is required and must be above zero{' '}
          </Text>
        )}
      </div>

      <EntityButton
        mode={selected ? 'detail' : 'new'}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}

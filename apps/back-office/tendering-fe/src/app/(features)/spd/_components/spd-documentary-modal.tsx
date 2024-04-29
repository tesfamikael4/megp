import { zodResolver } from '@hookform/resolvers/zod';
import { SpdDocumentaryEvidence } from '@/models/spd/documentary-evidence.model';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  NativeSelect,
  Stack,
  TextInput,
} from '@mantine/core';
import { notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { useCreateMutation } from '../_api/spd-documentary-evidence.api';
import { useParams } from 'next/navigation';

interface SpdDocumentaryModalProps {
  returnFunction: () => void;
}
const evidenceTypes = [
  {
    value: 'VTL',
    label: 'Valid Trade License',
  },
  {
    value: 'VRC',
    label: 'Vat Registration Certificate',
  },
  {
    value: 'VTCC',
    label: 'Valid Tax Clearance Certificate',
  },
  {
    value: 'BORC',
    label: 'Business Organization Registration Certificate',
  },
  {
    value: 'RPPC',
    label: 'Relevant Professional Practice Certificate',
  },
  {
    value: 'BS',
    label: 'Bid Security',
  },
  {
    value: 'PMD',
    label: 'Preference Margin Declaration',
  },
  {
    value: 'OD',
    label: 'Other Documents',
  },
];

const requiredToList = [
  {
    value: 'LocalBiddersOnly',
    label: 'Local bidders only',
  },
  {
    value: 'ForeignBiddersOnly',
    label: 'Foreign bidders only',
  },
  {
    value: 'BothLocalAndForeignBidders',
    label: 'Both local and foreign bidders',
  },
];
export default function SpdDocumentaryModal({
  returnFunction,
}: SpdDocumentaryModalProps) {
  const { id } = useParams();
  const DocumentaryFormSchema: ZodType<Partial<SpdDocumentaryEvidence>> =
    z.object({
      evidenceTitle: z
        .string()
        .min(1, { message: 'Evidence Title is required' }),
      evidenceType: z.string().min(1, { message: 'Evidence Type is required' }),
      spdDocumentaryEvidenceId: z.string(),
      checkOnFirstCompliance: z.boolean({
        required_error: 'Check On First Compliance is required',
      }),
      checkOnFirstOpening: z.boolean({
        required_error: 'Check On First Opening is required',
      }),
      checkOnSecondCompliance: z.boolean({
        required_error: 'Check On second Compliance is required',
      }),
      checkOnSecondOpening: z.boolean({
        required_error: 'Check On second Opening is required',
      }),
      isRequired: z.boolean(),
      requiredTo: z.string().min(1, { message: 'Required To is required' }),
      sectionLink: z.string().min(1, { message: 'Section Link is required' }),
    });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(DocumentaryFormSchema),
  });

  const [create, { isLoading }] = useCreateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        spdId: id.toString() ?? '',
      });
      notify('Success', 'SPD Documentary Evidence created successfully');
      returnFunction();
    } catch (err) {
      notify('Error', 'Error in creating SPD Documentary Evidence');
    }
  };

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      <Flex direction={'column'} gap={'lg'}>
        <Flex gap={'md'}>
          <TextInput
            withAsterisk
            label="Evidence Title"
            className="w-1/2"
            error={
              errors?.evidenceTitle
                ? errors?.evidenceTitle?.message?.toString()
                : ''
            }
            {...register('evidenceTitle')}
          />
          <NativeSelect
            placeholder="Evidence Type"
            withAsterisk
            className="w-1/2"
            label="Evidence Type"
            data={[...evidenceTypes]}
            error={
              errors?.evidenceType
                ? errors?.evidenceType?.message?.toString()
                : ''
            }
            {...register('evidenceType')}
          />
        </Flex>
        <Flex gap={'md'}>
          <Checkbox
            label="Check On First Compliance"
            className="w-1/2"
            {...register('checkOnFirstCompliance')}
          />
          <Checkbox
            label="Check On First Opening"
            className="w-1/2"
            {...register('checkOnFirstOpening')}
          />
        </Flex>
        <Flex gap={'md'}>
          <Checkbox
            label="Check On Second Compliance"
            className="w-1/2"
            {...register('checkOnSecondCompliance')}
          />
          <Checkbox
            label="Check On Second Opening"
            className="w-1/2"
            {...register('checkOnSecondOpening')}
          />
        </Flex>
        <Flex gap={'md'}>
          <TextInput
            label="Spd Documentary Evidence Id"
            className="w-1/2"
            error={
              errors?.spdDocumentaryEvidenceId
                ? errors?.spdDocumentaryEvidenceId?.message?.toString()
                : ''
            }
            {...register('spdDocumentaryEvidenceId')}
          />
          <TextInput
            withAsterisk
            label="Section Link"
            className="w-1/2"
            error={
              errors?.sectionLink
                ? errors?.sectionLink?.message?.toString()
                : ''
            }
            {...register('sectionLink')}
          />
        </Flex>
        <Flex gap={'md'} align={'center'}>
          <Checkbox
            label="Is Required"
            className="w-1/2"
            {...register('isRequired')}
          />
          <NativeSelect
            placeholder="Required To"
            withAsterisk
            className="w-1/2"
            label="Required To"
            data={[...requiredToList]}
            error={
              errors?.requiredTo ? errors?.requiredTo?.message?.toString() : ''
            }
            {...register('requiredTo')}
          />
        </Flex>
        <EntityButton
          mode={'new'}
          onCreate={handleSubmit(onCreate)}
          onReset={reset}
        />
      </Flex>
    </Stack>
  );
}

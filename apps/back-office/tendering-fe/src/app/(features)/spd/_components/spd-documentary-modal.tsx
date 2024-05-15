import { zodResolver } from '@hookform/resolvers/zod';
import { SpdDocumentaryEvidence } from '@/models/spd/documentary-evidence.model';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  NativeSelect,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { useCreateMutation } from '../_api/spd-documentary-evidence.api';
import { useParams } from 'next/navigation';
import { useLazyListByIdQuery } from '../_api/bid-form.api';

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
  const [trigger, { data: bidFormLinks, isLoading: isBidFormLoading }] =
    useLazyListByIdQuery();

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

  useEffect(() => {
    logger.log(errors);
  }, [errors]);

  useEffect(() => {
    if (id) {
      trigger({
        id: id.toString(),
        collectionQuery: { where: [] },
      });
    }
  }, [id, trigger]);
  return (
    <Stack>
      <LoadingOverlay visible={isLoading || isBidFormLoading} />
      <Flex direction={'column'} gap={'lg'}>
        <Flex gap={'md'}>
          <Textarea
            withAsterisk
            label="Evidence Title"
            className="w-full"
            error={
              errors?.evidenceTitle
                ? errors?.evidenceTitle?.message?.toString()
                : ''
            }
            {...register('evidenceTitle')}
          />
        </Flex>

        <Flex gap={'md'}>
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

          <NativeSelect
            placeholder="Bid Form Link"
            withAsterisk
            label="Form Link"
            className="w-1/2"
            error={
              errors?.sectionLink
                ? errors?.sectionLink?.message?.toString()
                : ''
            }
            data={
              bidFormLinks?.items
                ? bidFormLinks?.items.map((link) => ({
                    label: link.title,
                    value: link.code,
                  }))
                : []
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

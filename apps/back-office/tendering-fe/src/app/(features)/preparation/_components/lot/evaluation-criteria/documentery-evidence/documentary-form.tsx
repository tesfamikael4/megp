'use client';
import {
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useReadQuery,
} from '@/app/(features)/preparation/_api/lot/documentary-evidence.api';
import { DocumentaryEvidence } from '@/models/tender/lot/documentary-evidence.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  NativeSelect,
  Stack,
  TextInput,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const evidenceTypes = [
  {
    value: 'power of attorney',
    label: 'Power Of Attorney',
  },
  {
    value: 'articles of incorporation',
    label: 'Articles Of Incorporation',
  },
  {
    value: 'letter of intent to form jv',
    label: 'Letter Of Intent To Form JV',
  },
  {
    value: 'state owned enterprise eligbility',
    label: 'state owned enterprise eligbility',
  },
  {
    value: 'organizational structure',
    label: 'organizational structure',
  },
  {
    value: 'benefical ownership disclosure',
    label: 'benefical ownership disclosure',
  },
  {
    value: 'business registration certificate',
    label: 'business registration certificate',
  },
  {
    value: 'business license certificate',
    label: 'business license certificate',
  },
  {
    value: 'tax clearance certificate',
    label: 'tax clearance certificate',
  },
  {
    value: 'audited balance sheet',
    label: 'audited balance sheet',
  },
  {
    value: 'audited income statement',
    label: 'audited income statement',
  },
  {
    value: 'code of conduct agreement',
    label: 'code of conduct agreement',
  },
  {
    value: 'sub-contractors agreement',
    label: 'sub-contractors agreement',
  },
  {
    value: 'capabilities',
    label: 'capabilities',
  },
  {
    value: 'manufacturing authization',
    label: 'manufacturing authization',
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
interface DocumentaryFormProps {
  mode;
  adId;
  lotId: string;
  returnFunction: () => void;
}
export default function DocumentaryForm({
  mode,
  adId,
  lotId,
  returnFunction,
}: DocumentaryFormProps) {
  const DocumentaryFormSchema: ZodType<Partial<DocumentaryEvidence>> = z.object(
    {
      evidenceTitle: z
        .string()
        .min(10, { message: 'Evidence Title is required' }),
      evidenceType: z
        .string()
        .min(10, { message: 'Evidence Type is required' }),
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
    },
  );

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(DocumentaryFormSchema),
  });
  const {
    data: selected,
    isSuccess: isSuccess,
    isLoading: isLoading,
  } = useReadQuery(adId?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const onCreate = async (data) => {
    await create({
      ...data,
      lotId: lotId,
    })
      .unwrap()
      .then(() => {
        returnFunction();
        notify('Success', 'Documentary Evidence created successfully');
      })
      .catch((err) => {
        notify('Error', `Error in creating Documentary Evidence Error: ${err}`);
      });
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: adId?.toString() });
      notify('Success', 'Documentary evidence updated successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in updating documentary evidence');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      notify('Success', 'Documentary evidence deleted successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in deleting documentary evidence');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && isSuccess && selected !== undefined) {
      reset({
        evidenceTitle: selected?.evidenceTitle,
        evidenceType: selected?.evidenceType,
        checkOnFirstCompliance: selected?.checkOnFirstCompliance,
        checkOnFirstOpening: selected?.checkOnFirstOpening,
        checkOnSecondCompliance: selected?.checkOnSecondCompliance,
        checkOnSecondOpening: selected?.checkOnSecondOpening,
        isRequired: selected?.isRequired,
        requiredTo: selected?.requiredTo,
        sectionLink: selected?.sectionLink,
      });
    }
  }, [mode, reset, selected, isSuccess]);
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
          <Checkbox
            label="Is Required"
            className="w-1/2"
            {...register('isRequired')}
          />
        </Flex>
        <EntityButton
          mode={'new'}
          onCreate={handleSubmit(onCreate)}
          onUpdate={handleSubmit(onUpdate)}
          onDelete={handleSubmit(onDelete)}
          onReset={reset}
          isSaving={isSaving}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </Flex>
    </Stack>
  );
}

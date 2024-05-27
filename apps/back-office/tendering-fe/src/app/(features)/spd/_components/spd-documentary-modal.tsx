import { zodResolver } from '@hookform/resolvers/zod';
import { SpdDocumentaryEvidence } from '@/models/spd/documentary-evidence.model';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  NativeSelect,
  Stack,
  Textarea,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/spd-documentary-evidence.api';
import { useParams } from 'next/navigation';

interface SpdDocumentaryModalProps {
  mode: 'new' | 'detail';
  dId: string;
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
  mode,
  dId,
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
      sectionLink: z.string().optional(),
    });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(DocumentaryFormSchema),
  });

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(dId?.toString());

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        spdId: id.toString() ?? '',
        checkOnFirstCompliance: false,
        checkOnFirstOpening: false,
        checkOnSecondCompliance: false,
        checkOnSecondOpening: false,
      }).unwrap();
      notify('Success', 'SPD Documentary Evidence created successfully');
      returnFunction();
    } catch (err) {
      notify('Error', 'Error in creating SPD Documentary Evidence');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: dId?.toString(),
        spdId: id.toString() ?? '',
        checkOnFirstCompliance: false,
        checkOnFirstOpening: false,
        checkOnSecondCompliance: false,
        checkOnSecondOpening: false,
      });
      returnFunction();
      notify('Success', 'SPD Documentary Evidence updated successfully');
    } catch {
      notify('Error', 'Error in updating SPD Documentary Evidence');
    }
  };
  const onDelete = async () => {
    try {
      await remove(dId?.toString());
      notify('Success', 'SPD Documentary Evidence  deleted successfully');
    } catch {
      notify('Error', 'Error in deleting SPD Documentary Evidence');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        evidenceTitle: selected?.evidenceTitle,
        evidenceType: selected?.evidenceType,
        requiredTo: selected?.requiredTo,
        isRequired: selected?.isRequired,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);
  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
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
        <Flex gap={'md'} align={'center'}>
          <Checkbox
            label="Is Required"
            className="w-1/2"
            {...register('isRequired')}
          />
        </Flex>
        <EntityButton
          mode={mode}
          onCreate={handleSubmit(onCreate)}
          onUpdate={handleSubmit(onUpdate)}
          onDelete={handleSubmit(onDelete)}
          isSaving={isSaving}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onReset={reset}
        />
      </Flex>
    </Stack>
  );
}

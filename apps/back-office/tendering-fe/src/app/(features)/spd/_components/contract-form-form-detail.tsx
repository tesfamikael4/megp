import {
  FileInput,
  LoadingOverlay,
  NativeSelect,
  Stack,
  TextInput,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
} from '../_api/administrative-compliance.api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { ContractForm } from '@/models/spd/contract-forms.model';
import { useUploadContractFormMutation } from '../_api/contract-form-upload.api';
import { IconUpload } from '@tabler/icons-react';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
}

export function ContractFormFormDetail({ mode, adId }: FormDetailProps) {
  const contractFormSchema: ZodType<Partial<ContractForm>> = z.object({
    title: z.string().min(1, { message: 'This field is required' }),
    code: z.string().min(1, { message: 'This field is required' }),
    type: z
      .enum(['contract', 'performance-guaranty', 'advance-guaranty'])
      .optional(),
  });
  const [file, setFile] = useState<File[] | null>(null);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(contractFormSchema),
  });
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const { id } = useParams();

  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [uploadFile, { isLoading: isUploading }] =
    useUploadContractFormMutation();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(adId?.toString());

  const onCreate = async (data) => {
    logger.log('here');
    try {
      const formData = new FormData();
      formData.append('file', file ? file[0] : '');
      formData.append('spdId', id as any);
      formData.append('title', data.title);
      formData.append('code', data.code);
      formData.append('type', data.type);
      await uploadFile(formData);
      notify('Success', 'Bid form created successfully');
    } catch (err) {
      notify('Error', 'Error in creating contract form');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, pdId: id, id: adId?.toString() });
      notify('Success', 'Bid form updated successfully');
    } catch {
      notify('Error', 'Error in updating contract form');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      notify('Success', 'Bid form deleted successfully');
    } catch {
      notify('Error', 'Error in deleting contract form');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        title: selected?.title,
        code: selected?.code,
        type: selected?.type,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <TextInput
        label="Title"
        withAsterisk
        error={errors?.title ? errors?.title?.message?.toString() : ''}
        {...register('title')}
      />
      <TextInput
        label="Code"
        withAsterisk
        error={errors?.code ? errors?.code?.message?.toString() : ''}
        {...register('code')}
      />
      <div className="flex space-x-4">
        <NativeSelect
          placeholder="Form type"
          withAsterisk
          className="w-1/2"
          label="Form type"
          data={['contract', 'performance-guaranty', 'advance-guaranty']}
          {...register('type')}
        />
        <FileInput
          accept=".docx"
          multiple
          label="Document"
          withAsterisk
          className="my-2 w-1/2"
          leftSection={<IconUpload />}
          onChange={(files) => setFile(files)}
        />
      </div>

      <EntityButton
        mode={mode}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        isSaving={isUploading}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}

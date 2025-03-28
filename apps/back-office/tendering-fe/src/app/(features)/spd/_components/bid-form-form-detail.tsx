import {
  FileInput,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
} from '../_api/administrative-compliance.api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { BidForm } from '@/models/spd/bid-forms.model';
import { useUploadBidFormMutation } from '../_api/bid-form-upload.api';
import { IconUpload } from '@tabler/icons-react';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  returnFunction: () => void;
}

export function BidFormFormDetail({
  mode,
  adId,
  returnFunction,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<BidForm>> = z.object({
    title: z.string().min(1, { message: 'This field is required' }),
    code: z.string().min(1, { message: 'This field is required' }),
    type: z.enum(['technical', 'financial', 'bid-security']).optional(),
  });
  const [file, setFile] = useState<File[] | null>(null);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const { id } = useParams();

  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadBidFormMutation();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(adId?.toString());

  const onCreate = async (data) => {
    logger.log('here');

    const formData = new FormData();
    formData.append('file', file ? file[0] : '');
    formData.append('spdId', id as any);
    formData.append('title', data.title);
    formData.append('code', data.code);
    formData.append('type', data.type);
    await uploadFile(formData)
      .unwrap()
      .then(() => {
        notify('Success', `Bid form created successfully`);
        returnFunction();
      })
      .catch((err) => {
        logger.log(err);
        const keys = err.data.message.join(',');
        notify(
          'Error',
          `Error in uploading bid form missing keys in the document ${keys}`,
        );
      });
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, pdId: id, id: adId?.toString() });
      returnFunction();
      notify('Success', 'Bid form updated successfully');
    } catch {
      notify('Error', 'Error in updating bid form');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      returnFunction();
      notify('Success', 'Bid form deleted successfully');
    } catch {
      notify('Error', 'Error in deleting bid form');
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
        <Controller
          control={control}
          name="type"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={['technical', 'financial', 'instructional']}
              label="Form Type"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Form Type"
              searchable
              value={value}
            />
          )}
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

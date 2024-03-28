import { Button, FileInput, Flex, Group, Radio, Textarea } from '@mantine/core';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

import { GuaranteeRequest } from '@/models/guarantee-request';
import { useChangeStatusMutation } from '@/store/api/status/status.api';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { notify } from '@megp/core-fe';
import { IconUpload } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

export function FormDetail({ mode }: FormDetailProps) {
  const requestSchema: ZodType<Partial<GuaranteeRequest>> = z.object({
    attachment: z.string().optional(),
    guarantorValidityDate: z.date().optional(),
    remark: z.string().optional(),
    status: z.string().optional(),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<Partial<GuaranteeRequest>>({
    resolver: zodResolver(requestSchema),
  });

  const [showRemark, setShowRemark] = useState(false);
  const [value, setValue] = useState('');

  const [file, setFile] = useState<File[]>();
  const { id } = useParams();
  const [update] = useChangeStatusMutation();
  const [, setIsLoading] = useState(false);
  const upload = async (
    files: FileList | null,

    dataModified: any,
  ) => {
    if (!files) {
      setIsLoading(false);
      !showRemark && notify('Error', 'No file selected');
      return;
    }

    const fileList = Array.from(files || []);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const dataSent = showRemark
        ? {
            ...dataModified,
          }
        : {
            ...dataModified,

            attachment: {
              originalname: file.name,
              contentType: file.type,
              guaranteeRequestId: id?.toString,
            },
          };
      try {
        const url = await update({ ...dataSent, id: id.toString() }).unwrap();
        if (!showRemark) {
          await uploadFile(file, url.presignedUrl);
        }
      } catch (error) {
        setIsLoading(false);
        notify('Error', 'Something went wrong ');
      }
    }
  };

  const uploadFile = async (file: File, url: string) => {
    try {
      await fetch(url, {
        method: 'PUT',
        body: file,
      });
      notify('Success', 'Document Uploaded Successfully');
      setIsLoading(false);
      close();
    } catch (error) {
      setIsLoading(false);
      notify('Error', 'Something went wrong while uploading document');
      throw error;
    }
  };
  const onUpdate = async (data) => {
    const dataModified = showRemark
      ? {
          ...data,
          id: id?.toString(),
          status: value,
          remark: data.remark,
        }
      : {
          status: value,
          guarantorValidityDate: data.guarantorValidityDate?.toISOString(),
        };

    try {
      // await update(dataModified).unwrap();
      await upload(file as unknown as FileList, dataModified);
      notifications.show({
        message: 'Status Updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'Error in Updating Status.',
        title: 'Error',
        color: 'red',
      });
    }
  };

  return (
    <>
      <Group mt="xs">
        <Radio
          label="Approve"
          checked={value === 'APPROVED'}
          onChange={() => {
            setValue('APPROVED'), setShowRemark(false);
          }}
        />
        <Radio
          label="Reject"
          checked={value === 'REJECTED'}
          onChange={() => {
            setValue('REJECTED'), setShowRemark(true);
          }}
        />
      </Group>

      {showRemark && value === 'REJECTED' ? (
        <Textarea
          label="Remark"
          resize="vertical"
          autosize
          minRows={2}
          maxRows={6}
          {...register('remark')}
        />
      ) : value === 'APPROVED' ? (
        <>
          <Flex gap={100} mt={10}>
            <FileInput
              multiple
              label="Attach File"
              placeholder="Attach File"
              leftSection={<IconUpload />}
              onChange={(files) => setFile(files)}
            />
            <Controller
              name="guarantorValidityDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DateInput
                  label="Guarantor validity date"
                  placeholder=" Select date"
                  value={value ? new Date(value) : new Date()}
                  defaultValue={new Date()}
                  onChange={onChange}
                  error={errors?.guarantorValidityDate?.message}
                />
              )}
            />
          </Flex>
        </>
      ) : null}

      <Button onClick={handleSubmit(onUpdate)} className="mt-5">
        Done
      </Button>
    </>
  );
}

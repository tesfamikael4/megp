'use client';
import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Select,
  Text,
  Textarea,
} from '@mantine/core';
import React, { useState } from 'react';
import FileUploader from '../../_components/uploader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferentialSchema } from './models/form-schema';
import { z } from 'zod';
import {
  useGetMarginalizedGroupQuery,
  useSubmitRequestMutation,
} from '@/store/api/preferential-treatment/preferential-treatment.api';
import { NotificationService } from '../../_components/notification';

const PreferentialTreatment = () => {
  const [submitPrefrential, { isLoading, isSuccess }] =
    useSubmitRequestMutation();
  const [additionalDocument, setAdditionalDocuments] = useState<number>(1);
  const { setValue, watch, handleSubmit } = useForm<
    z.infer<typeof preferentialSchema>
  >({
    defaultValues: {
      serviceId: '',
      certificate: undefined,
      certiNumber: '',
      additionalDocuments: [
        {
          attachment: undefined,
          type: '',
        },
      ],
      remark: '',
    },
    resolver: zodResolver(preferentialSchema),
  });
  const { data } = useGetMarginalizedGroupQuery({});

  const onSubmit = async (e) => {
    try {
      await submitPrefrential({ ...watch(), status: 'Submit' }).unwrap();
      NotificationService.successNotification(
        'Preferential Treatment Submitted Successfully',
      );
    } catch (error) {
      NotificationService.requestErrorNotification('Failed to save ');
    }
  };

  return (
    <form
      className="p-6 flex flex-col gap-y-3 border shadow-md max-w-1/2 w-1/2 mx-4"
      onSubmit={handleSubmit(onSubmit)}
      style={{ width: '50%' }}
    >
      <h1 className="text-xl font-semibold text-gray-600">
        Application For Preferential Treatment{' '}
      </h1>
      <Divider />
      <div className="w-1/3">
        <p className="text-lg">Preferential Treatment </p>
        <Select
          data={data ?? []}
          placeholder="Select a preferential treatment"
          allowDeselect={false}
          withCheckIcon={false}
          onChange={(value) => setValue('serviceId', value as string)}
        />
      </div>
      <Flex direction={'column'} gap={'sm'} className="w-1/3">
        <Text className="text-lg font-semibold underline p-1">Certificate</Text>
        <FileUploader
          id="businessRegistration_IncorporationCertificate"
          label="Attachment"
          placeholder="Choose File"
          onChange={(file) => setValue('certificate', file)}
          getImageUrl={null}
        />
        <Input.Wrapper label="Certificate Number">
          <Input
            placeholder="Certificate Number"
            onChange={(e) => setValue('certiNumber', e.target.value)}
          />
        </Input.Wrapper>
      </Flex>
      <Flex direction={'column'} gap={'sm'}>
        <Flex className="text-lg font-semibold underline p-1">
          Additional Documents
        </Flex>
        <Flex align={'center'} justify={'start'} gap={10} wrap={'wrap'}>
          {Array.from({ length: additionalDocument }).map((_, index) => (
            <Flex direction={'column'} gap={10} key={index}>
              <Input.Wrapper label="Document Type/Name" c={''}>
                <Input
                  onChange={(e) =>
                    setValue(
                      `additionalDocuments.${index}.type`,
                      e.target.value,
                    )
                  }
                />
              </Input.Wrapper>
              <FileUploader
                id={`businessRegistration_IncorporationCertificate${index}`}
                label="Attachment"
                placeholder="Choose File"
                onChange={(file) =>
                  setValue(`additionalDocuments.${index}.attachment`, file)
                }
                getImageUrl={null}
              />
            </Flex>
          ))}
          {additionalDocument < 3 && (
            <Button
              variant="subtle"
              onClick={() =>
                setAdditionalDocuments((prev) =>
                  prev < 3 ? additionalDocument + 1 : prev,
                )
              }
            >
              Add More
            </Button>
          )}
        </Flex>
      </Flex>
      <Textarea
        mt={20}
        label="Remark"
        placeholder="Remark"
        withAsterisk
        cols={10}
        className="w-1/3"
        maxRows={8}
        onChange={(e) => setValue(`remark`, e.target.value)}
      />

      <Flex gap={'md'}>
        <Button className="w-fit">Draft</Button>
        <Button type="submit" className="w-fit">
          Save
        </Button>
      </Flex>
    </form>
  );
};

export default PreferentialTreatment;

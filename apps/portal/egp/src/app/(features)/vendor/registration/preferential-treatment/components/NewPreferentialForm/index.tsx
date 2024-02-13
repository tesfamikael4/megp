'use client';
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Input,
  Select,
  Text,
  Textarea,
} from '@mantine/core';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useGetDraftApplicationQuery,
  useGetMarginalizedGroupQuery,
  useSubmitRequestMutation,
} from '@/store/api/preferential-treatment/preferential-treatment.api';
import { useRouter } from 'next/navigation';
import { IconUserCircle } from '@tabler/icons-react';
import { preferentialSchema } from '../../models/form-schema';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import CardLayout from '../../../profile-update/_components/card-layout/card-layout';
import FileUploader from '@/app/(features)/vendor/_components/uploader';
import { useDisclosure } from '@mantine/hooks';

const NewPreferentialForm = ({
  defaultValues,
  certificateUrl,
  isIbm,
}: {
  defaultValues: z.infer<typeof preferentialSchema>;
  certificateUrl?: string;
  isIbm?: boolean;
}) => {
  const [showRemove, setShowRemove] = useState<number | null>(null);
  const [submitPrefrential, { isLoading, isSuccess }] =
    useSubmitRequestMutation();
  const [additionalDocument, setAdditionalDocuments] = useState<number>(1);
  const {
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    register,
    control,
  } = useForm<z.infer<typeof preferentialSchema>>({
    defaultValues,
    resolver: zodResolver(preferentialSchema),
  });

  const { data } = useGetMarginalizedGroupQuery({});
  const router = useRouter();

  const onSubmit = async (e) => {
    try {
      await submitPrefrential({ ...watch(), status: 'Submit' }).unwrap();
      router.push(`/vendor/registration/track-applications`);
      NotificationService.successNotification(
        'Preferential Treatment Submitted Successfully',
      );
    } catch (error) {
      NotificationService.requestErrorNotification('Failed to save ');
    }
  };

  const handleSaveDraft = async () => {
    try {
      await submitPrefrential({ ...watch(), status: 'Draft' }).unwrap();
      NotificationService.successNotification(
        'Preferential Treatment Saved as a draft',
      );
    } catch (error) {
      NotificationService.requestErrorNotification('Failed to save ');
    }
  };

  return (
    <CardLayout
      withBorder
      className="w-full sm:w-2/3 mx-auto"
      header={
        <Flex className="w-full items-center justify-center">
          <Text fw={700} fz="xl">
            Application For Preferential Treatment
          </Text>
        </Flex>
      }
    >
      <form
        className="p-6 flex flex-col gap-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Flex className="w-full" gap={'md'}>
          <Controller
            name="serviceId"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <Select
                name={name}
                data={
                  isIbm
                    ? data.filter((pref) => pref.label === 'IBM')
                    : data.filter((pref) => pref.label !== 'IBM') ?? []
                }
                label="Preferential Treatment"
                placeholder="Select a preferential treatment"
                className="w-1/2"
                allowDeselect={false}
                withCheckIcon={false}
                error={errors.serviceId && <p>{errors.serviceId?.message}</p>}
                onChange={onChange}
                value={value}
                withAsterisk
              />
            )}
          />

          <Input.Wrapper
            label="Certificate Number "
            className="w-1/2"
            withAsterisk
          >
            <Input
              placeholder="Certificate Number"
              error={errors.certiNumber && <p>{errors.certiNumber?.message}</p>}
              {...register('certiNumber')}
            />
          </Input.Wrapper>
        </Flex>
        <Text className="border-b">Certificate</Text>
        <Grid columns={12} className="gap-3">
          <Grid.Col span={6}>
            <Input.Wrapper label="Document Type/Name" c={''}>
              <Input value={'Certificate'} disabled />
            </Input.Wrapper>
            <Controller
              name="certificate"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <FileUploader
                  id="businessRegistration_IncorporationCertificate"
                  label="Attachment"
                  placeholder="Choose File"
                  onChange={onChange}
                  onRemove={onChange}
                  getImageUrl={certificateUrl}
                  error={errors.certificate?.message}
                />
              )}
            />
          </Grid.Col>
          {Array.from({ length: additionalDocument }).map((_, index) => (
            <Grid.Col
              key={index}
              span={6}
              className="relative"
              onMouseEnter={() => setShowRemove(index)}
              onMouseLeave={() => setShowRemove(null)}
            >
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
            </Grid.Col>
          ))}
        </Grid>

        {additionalDocument < 3 && (
          <Button
            variant="outline"
            className={'w-fit'}
            onClick={() =>
              setAdditionalDocuments((prev) =>
                prev < 3 ? additionalDocument + 1 : prev,
              )
            }
          >
            Add More
          </Button>
        )}
        <Divider />
        {watch('serviceId') && (
          <Textarea
            mt={20}
            label={`Remark for ${data && data.find((val) => val.value === watch('serviceId')).label}`}
            placeholder={`Type Remark for ${data && data.find((val) => val.value === watch('serviceId')).label} here ...`}
            withAsterisk
            cols={10}
            className="w-1/2"
            rows={6}
            error={errors?.remark && <p>{errors?.remark?.message}</p>}
            {...register('remark')}
          />
        )}

        <Flex gap={'md'} mt={'lg'}>
          <Button variant="outline" onClick={() => handleSaveDraft()}>
            Draft
          </Button>
          <Button type="submit">Submit</Button>
        </Flex>
      </form>
    </CardLayout>
  );
};

export default NewPreferentialForm;

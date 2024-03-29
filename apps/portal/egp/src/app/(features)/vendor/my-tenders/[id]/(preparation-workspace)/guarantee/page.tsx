'use client';
import { Extension } from '@/models/extension';
import { useExtendGuaranteeMutation } from '@/store/api/guarantee-extension/extension.api';
import { useGetGuaranteeQuery } from '@/store/api/guarantee/guarantee.api';
import { useGetRegisteredBidQuery } from '@/store/api/registered-bid/registered-bid.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Flex, Modal, Text, Textarea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { logger } from '@megp/core-fe';
import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import Table from '../../../_components/table/table';

const GuaranteePage = () => {
  const extensionSchema: ZodType<Partial<Extension>> = z.object({
    extensionDate: z
      .date()
      .min(new Date(), { message: 'This field is required' }),

    remark: z.string().optional(),
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<Partial<Extension>>({
    resolver: zodResolver(extensionSchema),
  });
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const { id } = useParams();
  const { data: data } = useGetGuaranteeQuery({});
  const { data: tenderData } = useGetRegisteredBidQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useExtendGuaranteeMutation();
  const onCreate = async (data) => {
    logger.log(data);
    close();
    try {
      const result = await create(data).unwrap();
      if ('data' in result) {
        router.push(`/vendor/my-tenders/${id}/guarantee/${result.data.id}`);
      }
      notifications.show({
        message: 'Guarantee exteneded successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'errors in extending guarantee.',
        title: 'Error',
      });
    }
  };

  const handleButtonClick = () => {
    router.push(`/vendor/my-tenders/${id}/guarantee/new`);
  };
  const onError = (err) => logger.log(err);
  return (
    <Box className="p-6 w-full bg-[#e7f4f7]">
      <Box className=" w-full p-6 min-h-screen bg-white">
        <Flex direction={'column'} className="w-full py-2 mb-3 ">
          <Text fw={700} fz="xl" c={'#1D8E3F'}>
            Guarantee List
          </Text>
          <Flex justify="flex-end " gap="md">
            {/* {data?.data < 0 ? (
              <Button onClick={handleButtonClick}>New Guarantee</Button>
            ) : (
              <Button disabled onClick={handleButtonClick}>
                New Guarantee
              </Button>
            )} */}
            <Button onClick={handleButtonClick}>New Guarantee</Button>

            <Button onClick={open}>Date</Button>
          </Flex>

          <Modal
            opened={opened}
            onClose={close}
            title="Extend Guarantee"
            centered
          >
            <Controller
              name="extensionDate"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <DatePickerInput
                  label="Extend"
                  withAsterisk
                  placeholder="Pick a date here"
                  value={value ? new Date(value) : new Date()}
                  onChange={onChange}
                  error={errors?.extensionDate?.message}
                />
              )}
            />

            <Textarea
              label="Remark"
              resize="vertical"
              autosize
              minRows={2}
              maxRows={6}
              {...register('remark')}
            />
            <Flex justify="flex-end" gap={10}>
              <Button variant="outline" className="mt-5" onClick={close}>
                Cancel
              </Button>

              <Button
                onClick={handleSubmit(onCreate, onError)}
                className="mt-5"
              >
                Done
              </Button>
            </Flex>
          </Modal>
        </Flex>
        <Table data={data} tenderData={tenderData} />
      </Box>
    </Box>
  );
};

export default GuaranteePage;

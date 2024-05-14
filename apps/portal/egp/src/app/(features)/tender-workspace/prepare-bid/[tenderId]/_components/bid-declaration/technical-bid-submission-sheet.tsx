import { useLazyGetBdsPreparationQuery } from '@/app/(features)/tender-workspace/_api/bid-attribute-datas';
import {
  useLazyGetTenderBidResponseQuery,
  useSaveTenderBidResponseMutation,
} from '@/app/(features)/tender-workspace/_api/tender-bid-response.api';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import { BiddersAuthorizedPerson } from '@/models/tender/bid-declaration/technical-bid-submission';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Section, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { IconDeviceFloppy, IconPlus, IconX } from '@tabler/icons-react';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const TechnicalBidSubmissionSheet = () => {
  const bidderAuthorizedRepresentative: ZodType<
    Partial<BiddersAuthorizedPerson>
  > = z.object({
    fullName: z.string().min(1, { message: 'This field is required' }),
    email: z.string().email({ message: 'invalid email address' }),
    phone: z.string().min(1, { message: 'This field is required' }),
    position: z.string().min(1, { message: 'This field is required' }),
  });
  const { tenderId } = useParams();
  const [trigger, { data, isLoading }] = useLazyGetBdsPreparationQuery();
  const [
    triggerGetSubmissionSheet,
    { data: submissionSheet, isLoading: isSubmissionLoading },
  ] = useLazyGetTenderBidResponseQuery();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(bidderAuthorizedRepresentative),
  });
  const prepareBidContext = useContext(PrepareBidContext);
  const [saveChanges, { isLoading: isSaving }] =
    useSaveTenderBidResponseMutation();
  useEffect(() => {
    if (submissionSheet !== undefined) {
      reset({
        fullName: submissionSheet?.value?.authorizedPerson?.fullName,
        email: submissionSheet?.value?.authorizedPerson?.email,
        phone: submissionSheet?.value?.authorizedPerson?.phone,
        position: submissionSheet?.value?.authorizedPerson?.position,
      });
    }
  }, [reset, submissionSheet]);

  useEffect(() => {
    if (tenderId && prepareBidContext?.password) {
      trigger(tenderId.toString());
      triggerGetSubmissionSheet({
        tenderId: tenderId,
        documentType: prepareBidContext?.documentType,
        key: 'technicalBidSubmissionSheet',
        password: prepareBidContext?.password,
      });
    }
  }, [tenderId, trigger, triggerGetSubmissionSheet, prepareBidContext]);
  const handleSaveChanges = (data) => {
    saveChanges({
      tenderId: tenderId,
      key: 'technicalBidSubmissionSheet',
      documentType: prepareBidContext?.documentType,
      value: {
        value: {
          submitted: false,
          bidValidityPeriod: data.bidValidityPeriod,
          authorizedPerson: data,
        },
      },
      password: prepareBidContext?.password,
    })
      .unwrap()
      .then(() => {
        notify('Success', 'lot value saved successfully');
      })
      .catch(() => {
        notify('Error', 'error while saving');
      });
  };
  return (
    <Section title="Technical bid submission sheet">
      <LoadingOverlay
        visible={isLoading || isSubmissionLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Box className="w-full">
        <Flex
          direction="column"
          className="border-t border-l border-r border-gray-400"
        >
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              Bid Submission Date
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50 text-xs text-red-500">
              * bid is not submitted yet
            </Box>
          </Flex>
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              Bid Validity
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50">
              {data && data.bidValidityPeriod}
            </Box>
          </Flex>
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              <Box className="flex justify-between">
                <Box>Bidders Authorized Person</Box>
              </Box>
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50">
              <TextInput
                label="Full Name"
                withAsterisk
                error={
                  errors?.fullName ? errors?.fullName?.message?.toString() : ''
                }
                {...register('fullName')}
              />
              <TextInput
                label="Position"
                withAsterisk
                error={
                  errors?.position ? errors?.position?.message?.toString() : ''
                }
                {...register('position')}
              />
              <TextInput
                label="Email"
                withAsterisk
                error={errors?.email ? errors?.email?.message?.toString() : ''}
                {...register('email')}
              />
              <TextInput
                label="Phone number"
                withAsterisk
                error={errors?.phone ? errors?.phone?.message?.toString() : ''}
                {...register('phone')}
              />
            </Box>
          </Flex>
        </Flex>
        <Box className="flex justify-end mt-4">
          <Button loading={isSaving} onClick={handleSubmit(handleSaveChanges)}>
            <IconDeviceFloppy size={14} /> Save Changes
          </Button>
        </Box>
      </Box>
    </Section>
  );
};

export default TechnicalBidSubmissionSheet;

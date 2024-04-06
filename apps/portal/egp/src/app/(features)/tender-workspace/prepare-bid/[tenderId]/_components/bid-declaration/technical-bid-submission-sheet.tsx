import { BiddersAuthorizedPerson } from '@/models/tender/bid-declaration/technical-bid-submission';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  Stack,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Section } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { IconPlus, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
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

  const [opened, { open, close }] = useDisclosure(false);
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [selected, setSelected] = useState<BiddersAuthorizedPerson>();
  const [authorizedRepresentatives, setAuthorizedRepresentatives] = useState<
    BiddersAuthorizedPerson[]
  >([]);
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(bidderAuthorizedRepresentative),
  });
  const onCreate = async (data) => {
    setAuthorizedRepresentatives([...authorizedRepresentatives, data]);
  };
  useEffect(() => {
    if (mode == 'detail' && selected !== undefined) {
      reset({
        fullName: selected?.fullName,
        email: selected?.email,
        phone: selected?.phone,
        position: selected?.position,
      });
    }
  }, [mode, reset, selected]);
  return (
    <Section title="Technical bid submission sheet">
      <Box className="w-full">
        <Flex
          direction="column"
          className="border-t border-l border-r border-gray-400"
        >
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              Bid Submission Date
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
          </Flex>
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              Bid Validity
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
          </Flex>
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              <Box className="flex justify-between">
                <Box>Bidders Authorized Person</Box>
                <Button onClick={open}>
                  <IconPlus size={14} /> Add
                </Button>
              </Box>
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50">
              {authorizedRepresentatives &&
                authorizedRepresentatives.map(
                  (authorizedRep: BiddersAuthorizedPerson) => (
                    <Box key={authorizedRep.email} className="my-2">
                      <Flex className="border-b border-gray-400 cursor-pointer group">
                        <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                          Full Name
                        </Box>
                        <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                          {authorizedRep.fullName}
                        </Box>
                      </Flex>
                      <Flex className="border-b border-gray-400 cursor-pointer group">
                        <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                          Position
                        </Box>
                        <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                          {authorizedRep.position}
                        </Box>
                      </Flex>
                      <Flex className="border-b border-gray-400 cursor-pointer group">
                        <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                          Email Address
                        </Box>
                        <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                          {authorizedRep.email}
                        </Box>
                      </Flex>
                      <Flex className="border-b border-gray-400 cursor-pointer group">
                        <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                          Phone number
                        </Box>
                        <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                          {authorizedRep.phone}
                        </Box>
                      </Flex>
                    </Box>
                  ),
                )}
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Modal
        opened={opened}
        size={'xl'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Bidders Authorized Person
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <Stack pos="relative">
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
            <EntityButton
              mode={mode}
              data={selected}
              onCreate={handleSubmit(onCreate)}
            />
          </Stack>
        </Box>
      </Modal>
    </Section>
  );
};

export default TechnicalBidSubmissionSheet;

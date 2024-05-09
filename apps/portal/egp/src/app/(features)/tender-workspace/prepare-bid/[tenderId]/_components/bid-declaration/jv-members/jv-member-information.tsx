import {
  JvMembers,
  JvMembersAuthorizedPerson,
} from '@/models/tender/bid-declaration/jv-members';
import {
  Box,
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Section, logger, notify } from '@megp/core-fe';
import {
  IconDeviceFloppy,
  IconFolderOpen,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import JvMemberForm from './jv-member-form';
import {
  useLazyGetLotBidResponseQuery,
  useSaveLotBidResponseMutation,
} from '@/app/(features)/tender-workspace/_api/lot-bid-response.api';
import { useSearchParams } from 'next/navigation';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import { useAuth } from '@megp/auth';
import { useLazyVenderByRegistrationIdQuery } from '@/app/(features)/tender-workspace/_api/bid-attribute-datas';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const JvMemberInformation = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [opened, { open: open, close }] = useDisclosure(false);
  const prepareBidContext = useContext(PrepareBidContext);
  const [trigger, { data: vendor, isLoading }] =
    useLazyVenderByRegistrationIdQuery();
  const [jvMembers, setJvMembers] = useState<JvMembers[]>([]);
  const [saveChanges, { isLoading: isSaving }] =
    useSaveLotBidResponseMutation();
  const [triggerJv, { data: jvMemberVal, isLoading: isJvLoading }] =
    useLazyGetLotBidResponseQuery();
  const bidderAuthorizedRepresentative: ZodType<Partial<any>> = z.object({
    vendorId: z.string().optional(),
    name: z.string().optional(),
    countryOfRegistration: z.string().optional(),
    registrationIssuedDate: z.string().optional().nullable(),
    address: z.object({
      physicalAddress: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional(),
      district: z.string().optional(),
      country: z.string().optional(),
      telephone: z.string().optional(),
      fax: z.string().optional(),
      postalAddress: z.string().optional(),
      primaryEmail: z.string().optional(),
    }),
    authorizedPersons: z.object({
      fullName: z.string().min(1, { message: 'This field is required' }),
      email: z.string().email({ message: 'invalid email address' }),
      telephone: z.string().min(1, { message: 'This field is required' }),
      position: z.string().min(1, { message: 'This field is required' }),
    }),
  });
  const jvMember: ZodType<any> = z.object({
    lotId: z.string().min(1, { message: 'this field is required' }),
    key: z.string().min(1, { message: 'this field is required' }),
    documentType: z.string().min(1, { message: 'this field is required' }),
    value: z.object({
      value: z.array(bidderAuthorizedRepresentative, {
        required_error: 'jv member is required',
      }),
    }),
    password: z.string().min(1, { message: 'this field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(jvMember),
  });
  const onCreate = async (data) => {
    const jv = [
      ...jvMembers,
      {
        ...data,
        address: { ...data },
      },
    ];
    setJvMembers(jv);
    close();
    reset({
      lotId: searchParams.get('lot'),
      key: 'jvMembersInformation',
      documentType: 'RESPONSE',
      value: { value: jv },
      password: prepareBidContext?.password,
    });
  };
  const handleSaveChanges = (data) => {
    saveChanges(data)
      .unwrap()
      .then(() => {
        notify('Success', 'lot value saved successfully');
      })
      .catch((error) => {
        logger.log(error);
        notify('Error', 'error while saving');
      });
  };
  useEffect(() => {
    if (user && user.organizations) {
      trigger(user.organizations[0].organization.code);
    }
  }, [trigger, user]);
  useEffect(() => {
    if (searchParams.get('lot') && prepareBidContext?.password) {
      triggerJv({
        lotId: searchParams.get('lot'),
        documentType: 'RESPONSE',
        key: 'jvMembersInformation',
        password: prepareBidContext?.password,
      });
    }
  }, [prepareBidContext?.password, searchParams, triggerJv]);

  useEffect(() => {
    if (jvMemberVal) {
      setJvMembers(jvMemberVal.value);
      reset({
        lotId: searchParams.get('lot'),
        documentType: 'RESPONSE',
        key: 'jvMembersInformation',
        password: prepareBidContext?.password,
        value: jvMemberVal,
      });
    }
  }, [jvMemberVal, prepareBidContext?.password, reset, searchParams]);
  return (
    <>
      <Section
        title="Jv Members Information"
        action={
          <Button onClick={open}>
            <IconPlus size={14} /> Add
          </Button>
        }
        defaultCollapsed={true}
      >
        <LoadingOverlay
          visible={isLoading || isJvLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {jvMembers.map((member, index) => (
          <Box className="w-full my-4" key={index}>
            <Flex
              direction="column"
              className="border-t border-l border-r border-gray-400"
            >
              <Flex className="border-b border-gray-400 cursor-pointer group">
                <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                  Bidder Legal Name
                </Box>
                <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                  {vendor.name}
                </Box>
              </Flex>
              <Flex className="border-b border-gray-400 cursor-pointer group">
                <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                  Country registration
                </Box>
                <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                  {vendor.countryOfRegistration}
                </Box>
              </Flex>
              <Flex className="border-b border-gray-400 cursor-pointer group">
                <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                  Year of registration
                </Box>
                <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                  {vendor.registrationIssuedDate}
                </Box>
              </Flex>
              <Flex className="border-b border-gray-400 cursor-pointer group">
                <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                  <Box className="flex justify-between">
                    <Box>Bidder Address</Box>
                  </Box>
                </Box>
                <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                  <Box className="my-2">
                    <Flex className="border-b border-gray-400 cursor-pointer group">
                      <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                        Physical address
                      </Box>
                      <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                        {vendor.physicalAddress}
                      </Box>
                    </Flex>
                    <Flex className="border-b border-gray-400 cursor-pointer group">
                      <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                        City
                      </Box>
                      <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                        {vendor.city}
                      </Box>
                    </Flex>
                    <Flex className="border-b border-gray-400 cursor-pointer group">
                      <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                        Region/state
                      </Box>
                      <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                        {vendor.region}
                      </Box>
                    </Flex>
                    <Flex className="border-b border-gray-400 cursor-pointer group">
                      <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                        Distinct
                      </Box>
                      <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                        {vendor.district}
                      </Box>
                    </Flex>
                    <Flex className="border-b border-gray-400 cursor-pointer group">
                      <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                        Country
                      </Box>
                      <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                        {vendor.countryOfRegistration}
                      </Box>
                    </Flex>
                    <Flex className="border-b border-gray-400 cursor-pointer group">
                      <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                        Phone number
                      </Box>
                      <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
                    </Flex>
                    <Flex className="border-b border-gray-400 cursor-pointer group">
                      <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                        Postal Code
                      </Box>
                      <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                        {vendor.postalAddress}
                      </Box>
                    </Flex>
                    <Flex className="border-b border-gray-400 cursor-pointer group">
                      <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                        Email
                      </Box>
                      <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                        {vendor.primaryEmail}
                      </Box>
                    </Flex>
                  </Box>
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
                      errors['value'] &&
                      errors['value']['value'] &&
                      (errors['value']['value'] ?? '')[`${index}`] &&
                      (errors['value']['value'] ?? '')[`${index}`][
                        'authorizedPersons'
                      ]
                        ? ((errors['value'] as any)['value'] ?? '')[`${index}`][
                            'authorizedPersons'
                          ]['fullName']?.message?.toString()
                        : ''
                    }
                    {...register(
                      `value.value.${index}.authorizedPersons.fullName`,
                    )}
                  />
                  <TextInput
                    label="Position"
                    withAsterisk
                    error={
                      errors['value'] &&
                      errors['value']['value'] &&
                      (errors['value']['value'] ?? '')[`${index}`] &&
                      (errors['value']['value'] ?? '')[`${index}`][
                        'authorizedPersons'
                      ]
                        ? ((errors['value'] as any)['value'] ?? '')[`${index}`][
                            'authorizedPersons'
                          ]['position']?.message?.toString()
                        : ''
                    }
                    {...register(
                      `value.value.${index}.authorizedPersons.position`,
                    )}
                  />
                  <TextInput
                    label="Email"
                    withAsterisk
                    error={
                      errors['value'] &&
                      errors['value']['value'] &&
                      (errors['value']['value'] ?? '')[`${index}`] &&
                      (errors['value']['value'] ?? '')[`${index}`][
                        'authorizedPersons'
                      ]
                        ? ((errors['value'] as any)['value'] ?? '')[`${index}`][
                            'authorizedPersons'
                          ]['email']?.message?.toString()
                        : ''
                    }
                    {...register(
                      `value.value.${index}.authorizedPersons.email`,
                    )}
                  />
                  <TextInput
                    label="Phone number"
                    withAsterisk
                    error={
                      errors['value'] &&
                      errors['value']['value'] &&
                      (errors['value']['value'] ?? '')[`${index}`] &&
                      (errors['value']['value'] ?? '')[`${index}`][
                        'authorizedPersons'
                      ]
                        ? ((errors['value'] as any)['value'] ?? '')[`${index}`][
                            'authorizedPersons'
                          ]['telephone']?.message?.toString()
                        : ''
                    }
                    {...register(
                      `value.value.${index}.authorizedPersons.telephone`,
                    )}
                  />
                </Box>
              </Flex>
            </Flex>
          </Box>
        ))}
        {jvMembers.length === 0 && (
          <div className="w-full bg-white flex flex-col h-48 justify-center items-center">
            <IconFolderOpen className="w-32 h-16 stroke-1" />
            <p className="text-base font-semibold">no jv added</p>
            <p>Please add a jv first</p>
          </div>
        )}

        {jvMembers.length > 0 && (
          <Box className="flex justify-end">
            <Button
              loading={isSaving}
              onClick={handleSubmit(handleSaveChanges)}
            >
              <IconDeviceFloppy size={14} /> Save Changes
            </Button>
          </Box>
        )}

        <Modal
          opened={opened}
          size={'xl'}
          onClose={close}
          withCloseButton={false}
        >
          <div className="flex justify-between">
            <h2 className="font-medium text-lg capitalize">Jv Members</h2>
            <IconX onClick={close} />
          </div>
          <Divider mt={'md'} mb={'md'} />
          <JvMemberForm onCreate={onCreate} />
        </Modal>
      </Section>
    </>
  );
};

export default JvMemberInformation;

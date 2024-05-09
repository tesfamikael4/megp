import { useLazyVenderByRegistrationIdQuery } from '@/app/(features)/tender-workspace/_api/bid-attribute-datas';
import { JvMembers } from '@/models/tender/bid-declaration/jv-members';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Flex, Stack, TextInput } from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const JvMemberForm = ({ onCreate }: { onCreate: (data) => void }) => {
  const jvMembersInformation: ZodType<Partial<{ registrationNo: string }>> =
    z.object({
      registrationNo: z.string().min(1, { message: 'This field is required' }),
    });
  const [trigger, { data: member, isLoading }] =
    useLazyVenderByRegistrationIdQuery();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(jvMembersInformation),
  });
  const onSearch = (data) => {
    trigger(data.registrationNo)
      .unwrap()
      .catch((err) => {
        notify('Error', 'cant find vendor with is registration number');
      });
  };
  return (
    <>
      <Stack pos="relative">
        <TextInput
          label="registrationNo"
          withAsterisk
          error={
            errors?.yearOfRegistration
              ? errors?.yearOfRegistration?.message?.toString()
              : ''
          }
          {...register('registrationNo')}
        />
        <Button
          type="submit"
          loading={isLoading}
          onClick={handleSubmit(onSearch)}
        >
          Check
        </Button>
        {member && (
          <Box>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">Name</Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                {member.name}
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                Country of registration
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                {member.countryOfRegistration}
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                Years of registration
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                {member.yearOfRegistration}
              </Box>
            </Flex>
            <Button
              type="submit"
              className="w-1/4 mt-3"
              loading={isLoading}
              onClick={() => {
                onCreate(member);
              }}
            >
              Add
            </Button>
          </Box>
        )}
      </Stack>
    </>
  );
};

export default JvMemberForm;

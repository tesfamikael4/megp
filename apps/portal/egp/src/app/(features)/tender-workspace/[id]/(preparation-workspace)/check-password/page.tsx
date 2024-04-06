'use client';
import { PasswordInput, Text, Button, Flex, Box } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useCheckPasswordMutation } from '@/app/(features)/vendor/_api/bid-response.api';
import { notify } from '@megp/core-fe';

const schema = z.object({
  password: z.string(),
});

type FormSchema = z.infer<typeof schema>;

const CheckPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  // State
  const router = useRouter();
  const { id } = useParams();
  const [checkPassword, { isLoading: isChecking }] = useCheckPasswordMutation();
  // Functions
  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    const payload = await checkPassword({
      tenderId: id,
      password: data.password,
      documentType: 'RESPONSE',
    });
    if (payload['data']) {
      sessionStorage.setItem(
        'password',
        JSON.stringify({ tenderId: id, password: data.password }),
      );
      router.push(`/tender-workspace/prepare-bid/${id}?tab=bid-declaration`);
    } else {
      notify('Error', 'incorrect password please insert correct password');
    }
  };

  useEffect(() => {
    if (
      sessionStorage.getItem('password') &&
      JSON.parse(sessionStorage.getItem('password') ?? '').tenderId === id
    ) {
      router.push(`/tender-workspace/prepare-bid/${id}?tab=bid-declaration`);
    }
  }, [id]);

  return (
    <Box>
      <Box className="flex items-center justify-center h-[80vh] my-auto">
        <Box className="w-1/3 p-3 bg-gray-100 border rounded">
          <Box className="flex items-center justify-center text-center">
            <svg
              className="w-20 h-20 m-4"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 40 40"
            >
              <path
                fill="#1B8E3E"
                d="M20,38.5C9.799,38.5,1.5,30.201,1.5,20S9.799,1.5,20,1.5S38.5,9.799,38.5,20S30.201,38.5,20,38.5z"
              />
              <path
                fill="#7dc794"
                d="M20,2c9.925,0,18,8.075,18,18s-8.075,18-18,18S2,29.925,2,20S10.075,2,20,2 M20,1 C9.507,1,1,9.507,1,20s8.507,19,19,19s19-8.507,19-19S30.493,1,20,1L20,1z"
              />
              <path
                fill="#fff"
                d="M25,17H15c-1.657,0-3,1.343-3,3v7h16v-7C28,18.343,26.657,17,25,17z"
              />
              <path
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                d="M20,24L20,24c-2.2,0-4-1.8-4-4v-4c0-2.2,1.8-4,4-4 h0c2.2,0,4,1.8,4,4v4C24,22.2,22.2,24,20,24z"
              />
            </svg>
          </Box>

          <Text className="my-4 text-lg font-semibold text-center text-gray-700">
            Please enter your Password
          </Text>

          <Flex direction="column">
            <PasswordInput
              error={errors.password?.message}
              label="Password"
              placeholder="Your password"
              {...register('password')}
              withAsterisk
            />
            <Button
              className="mt-6"
              type="submit"
              loading={isChecking}
              onClick={handleSubmit(onSubmit)}
            >
              Check
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
export default CheckPassword;

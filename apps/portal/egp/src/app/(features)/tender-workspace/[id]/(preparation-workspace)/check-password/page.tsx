'use client';
import {
  PasswordInput,
  Text,
  Button,
  Flex,
  Box,
  NativeSelect,
} from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useCheckPasswordMutation } from '@/app/(features)/vendor/_api/bid-response.api';
import { notify } from '@megp/core-fe';
import { useGetTenderQuery } from '@/app/(features)/procurement-notice/_api/tender.api';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';

const CheckPassword = () => {
  // State
  const router = useRouter();
  const { id } = useParams();
  const { data: selected, isLoading: isTenderDetailLoading } =
    useGetTenderQuery(id?.toString());
  const prepareBidContext = useContext(PrepareBidContext);
  const schema = z.object({
    password: z.string().min(1, { message: 'this field is required' }),
    documentType: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (selected?.bdsSubmission?.envelopType === 'two envelop') {
            return val && val.length > 0; // Password is required if envelopType is 'two envelop'
          }
          return true; // Password is optional otherwise
        },
        {
          message: 'This field is required for "two envelop" envelopType',
        },
      ),
  });
  type FormSchema = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });
  const [checkPassword, { isLoading: isChecking }] = useCheckPasswordMutation();
  // Functions
  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    const payload = await checkPassword({
      tenderId: id,
      password: data.password,
      documentType: data.documentType ? data.documentType : 'RESPONSE',
    });
    if (payload['data']) {
      sessionStorage.setItem(
        'password',
        JSON.stringify({
          tenderId: id,
          password: data.password,
          documentType: data.documentType ? data.documentType : 'RESPONSE',
          envelopType: selected?.bdsSubmission?.envelopType,
        }),
      );
      router.push(
        `/tender-workspace/prepare-bid/${id}?tab=${data.documentType === 'TECHNICAL_RESPONSE' || data.documentType === 'RESPONSE' ? 'bid-declaration' : 'financial-offer'}`,
      );
    } else {
      notify('Error', 'incorrect password please insert correct password');
    }
  };

  useEffect(() => {
    if (
      sessionStorage.getItem('password') &&
      JSON.parse(sessionStorage.getItem('password') ?? '').tenderId === id
    ) {
      router.push(
        `/tender-workspace/prepare-bid/${id}?tab=${JSON.parse(sessionStorage.getItem('password') ?? '')?.documentType === 'TECHNICAL_RESPONSE' || JSON.parse(sessionStorage.getItem('password') ?? '')?.documentType === 'RESPONSE' ? 'bid-declaration' : 'financial-offer'}`,
      );
    }
  }, [id, router]);

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
            {selected?.bdsSubmission?.envelopType === 'two envelop' && (
              <NativeSelect
                placeholder="Envelope Type"
                withAsterisk
                label="Envelope Type"
                className="my-2"
                data={[
                  { value: 'TECHNICAL_RESPONSE', label: 'Technical Response' },
                  { value: 'FINANCIAL_RESPONSE', label: 'Financial Response' },
                ]}
                error={
                  errors['documentType']
                    ? errors['documentType']?.message?.toString()
                    : ''
                }
                {...register('documentType')}
              />
            )}
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

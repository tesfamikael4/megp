'use client';
import {
  PasswordInput,
  Button,
  Text,
  Paper,
  Divider,
  Flex,
  Title,
  TextInput,
} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { z, ZodType } from 'zod';
import { useSetPasswordMutation } from '../../_api/custom.api';
import { notify } from '@megp/core-fe';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import ppda from './ppda.png';
import perago from './perago.png';
import styles from './auth.module.scss';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

interface Password {
  password: string;
}
interface Mode {
  mode: 'invite' | 'setPassword';
}

export default function SetPassWord({ mode }: Mode) {
  const Schema: ZodType<Password> = z.object({
    password: z
      .string()
      .min(1, { message: 'This field is required.' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[a-zA-Z]/, {
        message: 'Password must have at least one alphabet character',
      })
      .regex(/[0-9]/, { message: 'Password must have at least one number' }),
  });

  const {
    handleSubmit,

    formState: { errors },

    register,
  } = useForm({
    resolver: zodResolver(Schema),
  });
  const router = useRouter();

  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const id = searchParams.get('id');
  const otp = searchParams.get('otp');

  const [SetPassWord, { isLoading: isSetting }] = useSetPasswordMutation();

  const onCreate = async (data) => {
    try {
      await SetPassWord({
        ...data,
        isOtp: false,
        verificationId: id,
        otp: otp,
      }).unwrap();

      notify('Success', 'Password set successfully');
      router.push(`/auth/login`);
    } catch (err) {
      notify('Error', 'Error in setting password ');
    }
  };

  return (
    <Suspense>
      <div className="flex flex-row justify-center">
        <Paper
          radius="md"
          p="xl"
          withBorder
          mih={'100vh'}
          w={500}
          className="flex  flex-col  align-middle"
        >
          <Image
            alt="Malawi Republic"
            className={styles.logo}
            height={100}
            src={ppda.src}
            width={100}
          />

          <Divider my="lg" />

          <form onSubmit={handleSubmit(onCreate)}>
            <Title
              className="text-center"
              style={(theme) => ({
                fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                fontWeight: 750,
                fontSize: '1.5rem',
              })}
            >
              {mode === 'invite' ? 'Accept invitation' : 'Set password'}
            </Title>

            <TextInput
              label="First Name"
              value={firstName ? firstName : ''}
              disabled
            />

            <TextInput
              label="Last Name"
              disabled
              value={lastName ? lastName : ''}
            />

            {mode === 'setPassword' && (
              <PasswordInput
                error={
                  errors?.password ? errors?.password?.message?.toString() : ''
                }
                label="Password"
                placeholder="Your password"
                {...register('password')}
                mt="md"
              />
            )}

            <Button
              className="mt-4"
              fullWidth
              mt="xl"
              type="submit"
              loading={isSetting}
            >
              {mode === 'setPassword' ? 'Set Password' : 'Accept Invitation'}
            </Button>
          </form>

          <div className="mt-6">
            <p className={styles.footer_text}>
              Copyright &copy; 2023, Procurement and Disposal of Assets
              Authority.
            </p>
            <Flex className={styles.footer_text}>
              <p className="mt-2">Powered by </p>
              <Image
                alt="logo"
                className="mt-2 ml-1"
                height={30}
                src={perago.src}
                width={80}
              />
            </Flex>
          </div>
        </Paper>
      </div>
    </Suspense>
  );
}

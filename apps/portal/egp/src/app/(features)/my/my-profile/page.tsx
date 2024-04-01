'use client';

import {
  Card,
  Text,
  Container,
  Accordion,
  TextInput,
  Divider,
  Button,
  LoadingOverlay,
  Title,
  Paper,
  Box,
  Skeleton,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import PhoneOTP from './phoneOTP';
import { useAuth } from '@megp/auth';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import ChangeEmail from './change-email.component';

const schema = z.object({
  firstName: z.string().min(1, { message: 'This field is required.' }),
  lastName: z.string().min(1, { message: 'This field is required.' }),
});
type FormSchema = z.infer<typeof schema>;

export default function MyProfilePage() {
  const [userInfoloading, setUserInfoloading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const { getUserInfo, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUserInfoloading(true);
        const userInfo = await getUserInfo();
        if (!userInfo) {
          return;
        }
        if (userInfo['statusCode'] >= 400) {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: userInfo['message'],
          });
          router.push('/auth/login');
        } else {
          setUserInfo(userInfo);
        }
      } catch (err) {
      } finally {
        setUserInfoloading(false);
      }
    };

    fetchData();
  }, []);

  if (userInfoloading || !user) {
    return (
      <>
        <Box className="ml-10 mt-15 p-10 w-10/12">
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={50} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />
        </Box>
      </>
    );
  }

  return (
    <div className="mt-10 ml-10">
      <Paper shadow="sm" withBorder className="p-10">
        <p className="font-semibold text-xl">Profile Information</p>
        <Divider className="mb-2" />
        <TextInput label="Username" disabled value={user.username} />
        <TextInput label="First Name" disabled value={user.firstName} />
        <TextInput label="Last Name" disabled value={user.lastName} />
      </Paper>
      <Paper shadow="sm" withBorder className="p-10 mt-4">
        <PhoneOTP phone={user.phone as string} email={user.email} />
      </Paper>
      <ChangeEmail />
    </div>
  );
}

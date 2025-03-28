'use client';

import {
  Container,
  TextInput,
  Divider,
  Button,
  PasswordInput,
  Text,
  Paper,
  Flex,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ChangeSecurity } from '@megp/auth/src/components/auth/setSecurity/change-security';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@megp/auth';
import ChangeEmail from '../my-profile/change-email.component';

const schema = z.object({
  oldPassword: z.string().min(1, { message: 'This field is required.' }),
  newPassword: z
    .string()
    .min(1, { message: 'This field is required.' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-zA-Z]/, {
      message: 'Password must have at least one alphabet character',
    })
    .regex(/[0-9]/, { message: 'Password must have at least one number' }),
});
type FormSchema = z.infer<typeof schema>;

export default function MyProfilePage() {
  const { changePassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setIsChangingPassword(true);
      const changePass = await changePassword(data);
      if (!changePass) {
        return;
      }
      if (changePass.statusCode) {
        notifications.show({
          title: 'Error',
          color: 'red',
          message: "Old Password Doesn't Match",
        });
      } else {
        notifications.show({
          title: 'Success',
          color: 'green',
          message: 'Password Changed Successfully',
        });
        reset();
      }
    } catch (err) {
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <Paper shadow="sm" withBorder className="p-10">
            <Text className="font-semibold text-xl">Change Password</Text>
            <Divider className="mb-2" />
            <PasswordInput
              label="Old Password"
              withAsterisk
              placeholder="********"
              {...register('oldPassword')}
              error={errors.oldPassword?.message}
            />
            <PasswordInput
              label="New Password"
              withAsterisk
              placeholder="********"
              {...register('newPassword')}
              error={errors.newPassword?.message}
              className="mt-2"
            />
            <Button mt={15} type="submit" loading={isChangingPassword}>
              <IconDeviceFloppy /> Save
            </Button>
          </Paper>
        </form>
        <div className="mt-4 mb-4">
          <Paper shadow="sm" withBorder className="p-10">
            <Flex direction={'column'} className="mb-4">
              <p className="font-semibold text-xl">Change Security Questions</p>
              <Divider />
            </Flex>
            <Divider className="mb-2" />
            <ChangeSecurity mode="update" />
          </Paper>
        </div>
        <ChangeEmail />
      </Container>
    </>
  );
}

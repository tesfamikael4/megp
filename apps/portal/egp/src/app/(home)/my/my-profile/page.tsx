'use client';

import {
  Card,
  Text,
  Container,
  Accordion,
  TextInput,
  Divider,
  Button,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

const schema = z.object({
  firstName: z.string().min(1, { message: 'This field is required.' }),
  lastName: z.string().min(1, { message: 'This field is required.' }),
});
type FormSchema = z.infer<typeof schema>;
export default function MyProfilePage() {
  const [value, setValue] = useState<string[]>([
    'update-user',
    'change-password',
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const onSubmit = (data: any) => {
    // console.log(data)
  };

  return (
    <Container my={20}>
      <Card shadow="sm" withBorder>
        <Card.Section p="md" withBorder>
          <Text fw="500" fs="xl">
            User Information
          </Text>
        </Card.Section>
        <Card.Section p="md">
          <Accordion
            multiple
            value={value}
            onChange={setValue}
            chevronPosition="left"
            styles={{
              panel: {
                border: '1px solid #e2e8f0',
              },
              control: {
                border: '1px solid #e2e8f0',
                backgroundColor: '#f7fafc',
                borderRadius: '0 0 3px 3px',
              },
            }}
          >
            <Accordion.Item value="update-user">
              <Accordion.Control>Update User Information</Accordion.Control>
              <Accordion.Panel>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextInput
                    label="First Name"
                    withAsterisk
                    placeholder="First Name"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                  />
                  <Divider my={15} />
                  <TextInput
                    label="Last Name"
                    withAsterisk
                    placeholder="Last Name"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                  />
                  <Button mt={15} type="submit">
                    <IconDeviceFloppy /> Update
                  </Button>
                </form>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="change-password" mt={10}>
              <Accordion.Control>Change Password</Accordion.Control>
              <Accordion.Panel>
                <form>
                  <TextInput
                    label="Old Password"
                    withAsterisk
                    placeholder="********"
                    type="password"
                  />
                  <Divider my={15} />
                  <TextInput
                    label="New Password"
                    withAsterisk
                    placeholder="********"
                  />
                  <Divider my={15} />
                  <TextInput
                    label="Confirm Password"
                    withAsterisk
                    placeholder="********"
                  />
                  <Button mt={15} type="submit">
                    <IconDeviceFloppy /> Save
                  </Button>
                </form>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Card.Section>
      </Card>
    </Container>
  );
}

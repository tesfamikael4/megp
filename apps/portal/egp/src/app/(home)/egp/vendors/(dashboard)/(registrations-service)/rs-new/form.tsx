'use client';
import { SimpleGrid } from '@mantine/core';
import { RegisterVendorRequestForm } from './(form-components)/(layout)/registerVendorRequest';
import { RequestAlertMessage } from './(form-components)/(layout)/requestAlertMessage';
import { useForm, zodResolver } from '@mantine/form';
import { schema } from './(form-components)/(schema)/schema';
import { initialValues } from './(form-components)/(data)/initialValues';

export default function Form() {
  const form = useForm({
    initialValues,
    validate: zodResolver(schema),
  });

  return (
    <SimpleGrid
      cols={2}
      p={10}
      breakpoints={[
        { maxWidth: 'md', cols: 1, spacing: 'xl' },
        { maxWidth: 'sm', cols: 1, spacing: 'xl' },
      ]}
    >
      <RegisterVendorRequestForm form={form} />
      <RequestAlertMessage />
    </SimpleGrid>
  );
}

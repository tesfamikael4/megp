'use client';
import { SimpleGrid } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { schema } from './formConfig/schema';
import { initialValues } from './formConfig/initialValues';
import { RegisterVendorRequestForm } from './formConfig/parts/registerVendorRequest';
import { RequestAlertMessage } from './formConfig/parts/requestAlertMessage';

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

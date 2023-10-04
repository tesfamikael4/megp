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
      cols={{ base: 2, sm: 1, md: 1, lg: 2 }}
      spacing={{ base: 'xl', sm: 'xl' }}
      verticalSpacing={{ base: 'xl', sm: 'xl' }}
      className="p-4"
      bg={'none'}
    >
      <RegisterVendorRequestForm form={form} />
      <RequestAlertMessage />
    </SimpleGrid>
  );
}

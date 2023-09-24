import { Stack } from '@mantine/core';
import React from 'react';
import CardForm from '../../../../_shared/components/cardForm';

interface Props {
  form: any;
}
export const AreasOfBusinessInterest: React.FC<Props> = ({ form }) => {
  return (
    <>
      <Stack my={15}>
        <CardForm form={form} />
      </Stack>
    </>
  );
};

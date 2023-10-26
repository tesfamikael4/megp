'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddUserModal from '../_components/user-assignment';
import { Stack } from '@mantine/core';
import { useReadQuery } from '../_api/unit.api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ReadDetail } from '../_components/read-form';

export default function UnitDetailPage() {
  const { id } = useParams();
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const { data: selected, isSuccess } = useReadQuery(id?.toString());

  useEffect(() => {
    if (isSuccess && selected?.parentId === null) {
      setReadOnly(true);
    }
  }, [isSuccess, selected]);

  return (
    <Stack>
      <Section title="Unit Detail">
        {readOnly ? <ReadDetail /> : <FormDetail mode="detail" />}
      </Section>
      <AddUserModal />
    </Stack>
  );
}

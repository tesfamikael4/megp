'use client';
import { Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconGardenCart } from '@tabler/icons-react';
import { FormDetail } from '../_components/form-detail';
import { useParams, useRouter } from 'next/navigation';

export default function NewActivity() {
  const { id, budgetYear } = useParams();
  const router = useRouter();
  return (
    <>
      <Section
        title="Detail"
        action={
          <Button
            onClick={() =>
              router.push(
                `/pre-budget-plan/${budgetYear}/activities/items/${id}`,
              )
            }
          >
            <IconGardenCart />
            Items
          </Button>
        }
      >
        <FormDetail mode="detail" />
      </Section>
    </>
  );
}

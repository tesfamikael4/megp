'use client';
import Invitation from '@/app/(features)/rfx/_components/invitation/invitation.component';
import { Items } from '@/app/(features)/rfx/_components/item/items';
import { Box, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';

export default function DetailInvitations() {
  const { id, itemId } = useParams();
  const router = useRouter();

  return (
    <Flex className="gap-4">
      <Box className="w-2/5">
        <Section
          title={
            <Flex className="items-center">
              <IconChevronLeft
                className="cursor-pointer"
                onClick={() => router.push(`/rfx/${id}/invitation`)}
              />
              <p className="text-bold">PR Items</p>
            </Flex>
          }
          collapsible={false}
        >
          <Items layout="partition" viewMode="detail" />
        </Section>
      </Box>
      <Section className="w-3/5" title="Matched Products" collapsible={false}>
        <Invitation itemId={itemId.toString()} />
      </Section>
    </Flex>
  );
}

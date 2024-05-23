'use client';
import Invitation from '../../../_components/price-schedule/matched-products-list.component';
import Items from '../../../_components/price-schedule/item.component';
import { Box, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';

export default function DetailInvitations() {
  const { rfxId, itemId } = useParams();
  const router = useRouter();

  return (
    <Flex className="gap-4">
      <Box className="w-2/5">
        <Section
          title={
            <Flex className="items-center">
              <IconChevronLeft
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/invitations-workspace/prepare-bid/${rfxId}/price-schedule`,
                  )
                }
              />
              <p className="text-bold">RFQ Items</p>
            </Flex>
          }
          collapsible={false}
        >
          <Items layout="partition" viewMode="detail" />
        </Section>
      </Box>
      <Section className="w-3/5" title="Matched Products" collapsible={false}>
        {/* <Invitation itemId={itemId.toString()} /> */}
        <></>
      </Section>
    </Flex>
  );
}

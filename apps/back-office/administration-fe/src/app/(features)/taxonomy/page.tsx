'use client';

import { Box, Button, Modal, ScrollArea, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconPlus } from '@tabler/icons-react';
import { TreeView } from './_components/tree-view';
import { useDisclosure } from '@mantine/hooks';
import { FormDetail } from './_components/form-detail';

export default function TaxonomyPage() {
  const items = [
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '1d214dbd-8667-4cbe-9742-60253cc33464',
      name: 'Segment',
      code: '103101000',
      children: [
        {
          id: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
          parentId: '1d214dbd-8667-4cbe-9742-60253cc33464',
          name: 'Family',
          code: '103101000',
          children: [
            {
              id: '148366ec-cb79-48f0-a54c-99cf052307ba',
              parentId: '9934e5a3-2ef1-4bd9-8556-a5a4abeba76f',
              name: 'Class',
              code: '103101000',
              children: [
                {
                  id: '15272d4f-d78f-4c58-8e93-ff436a815219',
                  parentId: '148366ec-cb79-48f0-a54c-99cf052307ba',
                  name: 'Commodity',
                  code: '103101000',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Section
        className="h-max"
        collapsible={false}
        action={
          <>
            <Box className="mr-28 flex gap-5 mt-2">
              <Text size="xs">
                <span className="font-semibold">Name:</span> UNSPSC
              </Text>
              <Text size="xs">
                <span className="font-semibold">Version:</span> UNv240301
              </Text>
            </Box>

            <Button onClick={open}>
              <IconPlus size={16} stroke={2.2} /> Upload
            </Button>
          </>
        }
        title="Taxonomy"
      >
        <ScrollArea h={300} type="scroll" scrollbarSize={6}>
          <TreeView items={items} />
        </ScrollArea>

        <Modal size={'xl'} opened={opened} onClose={close} title="Add Taxonomy">
          <FormDetail mode="new" />
        </Modal>
      </Section>
    </>
  );
}

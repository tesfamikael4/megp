'use client';
import React, { useEffect } from 'react';
import { Section, Tree } from '@megp/core-fe';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Card, Modal, ScrollArea, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DetailCommodity } from './_components/detail-commodity';
import { items } from './data';
import { useListQuery } from './_api/taxonomy.api';
import { FormDetail } from './_components/form-detail';

const TaxonomyLayout = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [parents, setParents] = useState<any>();
  const [selectedData, setSelectedData] = useState<any>({});
  const { data, refetch } = useListQuery(undefined);

  return (
    <>
      <Card>
        <Box className="flex justify-between">
          <Box>
            <Text size="xs">
              <span className="font-semibold">Name:</span> UNSPSC UNv240301
            </Text>
            <Text size="xs">
              <span className="font-semibold">Version:</span> UNv240301
            </Text>
          </Box>

          <Button onClick={open} className="">
            <IconPlus size={16} stroke={2.2} /> Import
          </Button>
        </Box>
      </Card>

      <Box className="flex gap-4 items-start mt-2">
        <Section
          mh="400px"
          w="40%"
          collapsible={false}
          className=""
          title="Taxonomy"
          subTitle="Taxonomy List"
        >
          <ScrollArea h={400} type="scroll" scrollbarSize={6}>
            <Tree
              fieldNames={{ title: 'title', key: 'code' }}
              mode="view"
              url={(code) =>
                `http://localhost:3000/api/classifications/children?code=${code}`
              }
              data={data ? data.items : []}
              selectedKeys={[selectedData.key]}
              onClick={(node, parents) => {
                setSelectedData(node);
                setParents(parents);
              }}
            />

            {Object.keys(items).length === 0 && (
              <Box className="ml-24 mt-40">No Imported Data</Box>
            )}
          </ScrollArea>

          <Modal size={'xl'} opened={opened} onClose={close} title="Taxonomy">
            <FormDetail mode="new" refetch={refetch} />
          </Modal>
        </Section>

        <Section
          mh="500px"
          w="100%"
          title="Taxonomy"
          subTitle="Taxonomy Detail "
          collapsible={false}
        >
          {Object.keys(selectedData).length === 0 && (
            <Box className="ml-96 mt-48">No Selected Data</Box>
          )}

          {Object.keys(selectedData).length !== 0 && (
            <DetailCommodity selectedData={selectedData} parents={parents} />
          )}
        </Section>
      </Box>
    </>
  );
};
export default TaxonomyLayout;

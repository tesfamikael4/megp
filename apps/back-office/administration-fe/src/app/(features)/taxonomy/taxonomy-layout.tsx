'use client';
import React from 'react';
import { Section, Tree } from '@megp/core-fe';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Card, Modal, ScrollArea, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DetailCommodity } from './_components/detail-commodity';
import { useListQuery } from './_api/taxonomy.api';
import { FormDetail } from './_components/form-detail';
import { useGetLatestTaxonomiesQuery } from '@/store/api/taxonomies/taxonomies.api';

const TaxonomyLayout = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [parents, setParents] = useState<any>();
  const [selectedData, setSelectedData] = useState<any>({});
  const { data, refetch } = useListQuery(undefined);
  const { data: taxonomy, refetch: fetch } = useGetLatestTaxonomiesQuery(null);

  const handleRefetch = () => {
    refetch();
    fetch();
  };

  return (
    <>
      <Card>
        <Box className="flex justify-between">
          <Box>
            {taxonomy && (
              <>
                {' '}
                <Text size="xs">
                  <span className="font-semibold">Name:</span> {taxonomy?.name}
                </Text>
                <Text size="xs">
                  <span className="font-semibold">Version:</span>{' '}
                  {taxonomy?.version}
                </Text>
              </>
            )}
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
          <ScrollArea h={600} type="scroll" scrollbarSize={6}>
            <Tree
              fieldNames={{ title: 'title', key: 'code' }}
              mode="view"
              url={(code) =>
                `${
                  process.env.NEXT_PUBLIC_ADMINISTRATION_API ??
                  '/administration/api/'
                }classifications/children?q=w%3DparentCode%3A%3D%3A${code}`
              }
              data={data ? data.items : []}
              selectedKeys={[selectedData.key]}
              onClick={(node, parents) => {
                setSelectedData(node);
                setParents(parents);
              }}
            />

            {Object.keys(data ? data?.items : []).length === 0 && (
              <Box className="ml-24 mt-40">No Imported Data</Box>
            )}
          </ScrollArea>

          <Modal size={'xl'} opened={opened} onClose={close} title="Taxonomy">
            <FormDetail mode="new" refetch={handleRefetch} close={close} />
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
            <DetailCommodity
              selectedData={selectedData}
              parents={parents}
              setSelectedData={setSelectedData}
              setParents={setParents}
            />
          )}
        </Section>
      </Box>
    </>
  );
};
export default TaxonomyLayout;

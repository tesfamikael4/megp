'use client';
import React from 'react';
import { MantineTree, Section, Tree, TreeConfig } from '@megp/core-fe';
import { useState } from 'react';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import {
  Box,
  Button,
  Card,
  Flex,
  List,
  Modal,
  ScrollArea,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DetailCommodity } from './_components/detail-commodity';
import { useLazyListQuery, useListQuery } from './_api/taxonomy.api';
import { FormDetail } from './_components/form-detail';
import { useGetLatestTaxonomiesQuery } from '@/store/api/taxonomies/taxonomies.api';
import { IconSearch } from '@tabler/icons-react';
import { CollectionQuery, RelationConfig } from '@megp/entity';
import { TaxonomyList } from './_components/TaxonomyList';
import { useLazyGetClassificationsQuery } from './_api/classification.api';

const TaxonomyLayout = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [parents, setParents] = useState<any>();
  const [selectedData, setSelectedData] = useState<any>({});
  const [search, setSearch] = useDebouncedState('', 500);
  const [getChildren] = useLazyGetClassificationsQuery();

  const addConfig: RelationConfig<any> = {
    columns: [
      {
        id: 'name',
        header: '',
        accessorKey: 'title',
        meta: {
          widget: 'expand',
        },
        cell: ({ row: { original } }: any) => (
          <Flex
            py={5}
            px={'xs'}
            gap={'sm'}
            my={5}
            onClick={() => setSelectedData(original)}
            title={original.title}
          >
            [{original.code}]{' '}
            <Text w={350} truncate={'end'}>
              {original.title}
            </Text>
          </Flex>
        ),
      },
    ],
    searchable: true,
    disableMultiSelect: true,
    pagination: true,
  };

  const queryOptions: CollectionQuery = {
    where: [
      [
        {
          column: 'parentCode',
          value: 'IsNull',
          operator: 'IsNull',
        },
      ],
    ],
  };
  const treeConfig: TreeConfig<any> = {
    id: 'id',
    label: 'title',
    onClick: async (data) => {
      setSelectedData(data);
    },
    load: async (data) => {
      const res = await getChildren({
        where: [
          [
            {
              column: 'parentCode',
              value: data.code,
              operator: '=',
            },
          ],
        ],
      }).unwrap();
      return {
        result: res?.items ?? [],
        loading: isLoading,
      };
    },
  };

  const { data, refetch } = useListQuery(queryOptions);
  const { data: taxonomy, refetch: fetch } = useGetLatestTaxonomiesQuery(null);

  const handleRefetch = () => {
    refetch();
    fetch();
  };

  const [handleSearch, { data: searchedData, isLoading }] = useLazyListQuery();
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
          <Flex justify="flex-end" mb="md" mt="md">
            <TextInput
              className={'w-full'}
              leftSection={<IconSearch size="sm" stroke={1.5} />}
              miw={300}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
              }}
              placeholder="Search"
              rightSectionWidth={30}
              size="xs"
            />
          </Flex>
          <ScrollArea h={600} type="scroll" scrollbarSize={6}>
            {search ? (
              <TaxonomyList
                config={addConfig}
                data={searchedData ? searchedData.items : []}
                total={searchedData ? searchedData.total : 0}
                search={search}
                onRequestChange={handleSearch}
                isLoading={isLoading}
              />
            ) : (
              <MantineTree data={data ? data.items : []} config={treeConfig} />
            )}

            {Object.keys(data ? data?.items : []).length === 0 && (
              <Box className="ml-24 mt-40">No Data</Box>
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

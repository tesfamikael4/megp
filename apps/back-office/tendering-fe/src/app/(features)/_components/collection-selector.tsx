import {
  Box,
  Button,
  Checkbox,
  Group,
  Pagination,
  Radio,
  TextInput,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { Table, TableConfig, logger } from '@megp/core-fe';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const perPage = 10;

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0; // No pages if no items or itemsPerPage is non-positive.
  }

  return Math.ceil(totalItems / itemsPerPage);
}
interface CollectionSelectorInterface {
  config: any;
  data: any;
  multiSelect?: boolean;
  isForSplitting?: boolean;
  total: any;
  onDone: (item: any) => void;
  onRequestChange: (data: any) => void;
}
export const CollectionSelector = ({
  config,
  data,
  multiSelect,
  isForSplitting,
  total,
  onDone,
  onRequestChange,
}: CollectionSelectorInterface) => {
  const [selected, setSelected] = useState<any | any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useDebouncedState('', 500);

  const totalPages = calculateTotalPages(total, perPage);

  const selectableBox = multiSelect
    ? {
        id: 'select',
        header: '',
        accessorKey: 'select',
        cell: ({ row: { original } }: any) => (
          <Box className="w-fit">
            <Checkbox
              checked={selected.includes(original)}
              onChange={(data) => {
                if (data.target.checked) setSelected([...selected, original]);
                else
                  setSelected([
                    ...selected.filter((s) => s.id !== original.id),
                  ]);
              }}
            />
          </Box>
        ),
        meta: {
          widget: 'select',
        },
      }
    : {
        id: 'select',
        header: '',
        accessorKey: 'select',
        cell: ({ row: { original } }: any) => (
          <Radio
            checked={selected == original}
            onChange={(data) => {
              setSelected(original);
            }}
          />
        ),
        meta: {
          widget: 'select',
        },
      };
  const castedConfig: TableConfig<any> = {
    columns: [selectableBox, ...config.columns],
  };

  useEffect(() => {
    const from = (page - 1) * perPage;

    onRequestChange?.({
      skip: from,
      take: perPage,
      where: search
        ? [
            [
              {
                column: `description`,
                value: search,
                operator: 'ILIKE',
              },
            ],
          ]
        : [],
    });
  }, [page]);
  return (
    <>
      <TextInput
        className="mb-2"
        leftSection={<IconSearch />}
        miw={300}
        onChange={(event) => {
          setSearch(event.currentTarget.value);
        }}
        placeholder="Search"
        rightSectionWidth={30}
      />
      <Table config={castedConfig} data={data} />
      <Group justify="end" className="mt-2">
        <Pagination
          onChange={setPage}
          size="sm"
          total={totalPages}
          value={page}
          withEdges
        />
      </Group>
      <Group justify="end" className="mt-2">
        <Button onClick={() => onDone(selected)}>
          {isForSplitting ? 'Next' : 'Done'}
        </Button>
      </Group>
    </>
  );
};

import React, { useEffect, useState } from 'react';
import { Badge, Box, Flex, TextInput } from '@mantine/core';
import { IconBoxOff } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useRouter, useParams } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import sortBy from 'lodash.sortby';
import { BidSecurity } from '@/models/bidSecurity';

const PAGE_SIZES = [10, 15, 20];

interface Props {
  data: any;
  tenderData: any;
}

export default function Table({ data, tenderData }: Props) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { lotId } = useParams();
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<BidSecurity>
  >({
    columnAccessor: 'guarantorName',
    direction: 'asc',
  });
  const [transformedData, setTransformedData] = useState<BidSecurity[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BidSecurity[]>([]);
  const [paginatedData, setPaginatedData] = useState<BidSecurity[]>([]);

  useEffect(() => {
    setTransformedData(
      data?.items?.map((item: any) => ({
        name: tenderData?.organizationName,
        title: tenderData?.name,
        guarantorName: item?.guarantorName,
        guarantorBranchName: item?.guarantorBranchName,
        createdAt: item?.createdAt,
        status: item?.status,
        id: item?.id,
      })) || [],
    );
  }, [data, tenderData]);

  useEffect(() => {
    // Filter records based on the search query
    const filteredData = transformedData.filter(
      (record) =>
        Object.values(record).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(search.toLowerCase()),
        ) ||
        new Date(record.createdAt)
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          .toLowerCase()
          .includes(search.toLowerCase()),
    );

    setFilteredRecords(filteredData);
  }, [search, transformedData]);

  useEffect(() => {
    // Sort filtered records
    let sortedData = filteredRecords;
    if (sortStatus.columnAccessor === 'createdAt') {
      sortedData = sortBy(
        filteredRecords,
        (record) => new Date(record.createdAt),
      );
    } else {
      sortedData = sortBy(filteredRecords, sortStatus.columnAccessor);
    }
    if (sortStatus.direction === 'desc') {
      sortedData.reverse();
    }

    // Paginate sorted data
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setPaginatedData(sortedData.slice(from, to));
  }, [filteredRecords, sortStatus, page, pageSize]);

  const handleRowClick = (record: BidSecurity) => {
    router.push(
      `/tender-workspace/${id}/my-lots/${lotId}/guarantee/${record?.id}`,
    );
  };

  return (
    <>
      <Flex justify="space-between" className="my-2">
        <div></div>
        <TextInput
          leftSection={<IconSearch size={14} />}
          placeholder="Search"
          value={search}
          size="xs"
          onChange={(e) => setSearch(e.target.value)}
          miw={300}
          className="w-20"
        />
      </Flex>

      <DataTable
        striped
        verticalSpacing="sm"
        highlightOnHover
        rowBackgroundColor={(record, index) => {
          if (index % 2 !== 0) return '#e7f4f7';
        }}
        columns={[
          { accessor: 'title', title: 'Lot Name', sortable: true },
          { accessor: 'name', title: 'Procuring Entity ', sortable: true },
          {
            accessor: 'guarantorName',
            title: 'Guarantor Name ',
            sortable: true,
          },
          {
            accessor: 'guarantorBranchName',
            title: 'Guarantor Branch Name ',
            sortable: true,
          },
          {
            accessor: 'createdAt',
            title: 'Request Date',
            sortable: true,
            render: ({ createdAt }: any) =>
              new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
          },
          {
            accessor: 'status',
            sortable: true,
            render: ({ status }: any) => (
              <Badge
                color={
                  status === 'APPROVED'
                    ? 'green'
                    : status === 'REQUESTED ' || status === 'DRAFT'
                      ? 'yellow'
                      : 'red'
                }
                variant="light"
                fw={700}
                radius={'sm'}
              >
                {status}
              </Badge>
            ),
          },
        ]}
        noRecordsIcon={
          <Box p={4} mb={4}>
            <IconBoxOff />
          </Box>
        }
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        onRowClick={({ record }: any) => handleRowClick(record)}
        noRecordsText="No Data"
        styles={{ header: { backgroundColor: '#e8e8e8' } }}
        totalRecords={transformedData?.length}
        paginationActiveBackgroundColor="#1d8e3f"
        recordsPerPage={pageSize}
        page={page}
        onPageChange={setPage}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        records={paginatedData}
        recordsPerPageLabel="Guarantee per page"
      />
    </>
  );
}

import { Text, Table, ScrollArea, Breadcrumbs } from '@mantine/core';
import { useState } from 'react';
import { useListQuery } from '../_api/taxonomy.api';
import { Taxonomy } from '@/models/taxonomy';

type DetailCommodityProps = {
  selectedData: Taxonomy;
  setSelectedData: (newSelection: Taxonomy) => void;
  setParents: (newParents: Taxonomy[]) => void;
  parents: Taxonomy[];
};

const TableRow = ({ rowData }: { rowData: Taxonomy }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <Table.Tr key={rowData.title}>
      <Table.Td>
        <Text
          w={250}
          truncate="end"
          title={rowData?.title}
        >{`[${rowData.code}]:${rowData.title}`}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" onClick={toggleShowMore} className="cursor-pointer">
          {rowData.definition &&
            (showMore
              ? rowData.definition
              : rowData.definition.slice(0, 70) + '...')}
          {rowData.definition && (
            <span className="text-xs">
              {showMore ? 'See Less' : 'See More'}
            </span>
          )}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{rowData.synonym}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{rowData.acronym}</Text>
      </Table.Td>
    </Table.Tr>
  );
};

export const DetailCommodity = ({
  selectedData,
  setSelectedData,
  parents,
  setParents,
}: DetailCommodityProps) => {
  const { data: children } = useListQuery({
    where: [
      [
        {
          column: 'parentCode',
          value: selectedData?.code,
          operator: '=',
        },
      ],
    ],
  });
  const rows = children?.items?.map((element) => (
    <TableRow key={element.id} rowData={element} />
  ));

  return Object.keys(selectedData).length !== 0 ? (
    <>
      <ScrollArea h={600} type="scroll" scrollbarSize={6}>
        <Table h={100} className="mb-5">
          <Table.Tbody className="border-dashed border-2">
            <Table.Tr className="border-dashed border-2 ">
              <Table.Th className="bg-[#f1f1ff] w-36 ">Title</Table.Th>
              <Table.Td>
                <Text size="sm">{`[${selectedData.code}]:${selectedData.title}`}</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr className="border-dashed border-2 ">
              <Table.Th className="bg-[#f1f1ff] w-36  ">Key</Table.Th>
              <Table.Td>
                <Text size="sm">{selectedData.key}</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr className="border-dashed border-2 ">
              <Table.Th className="bg-[#f1f1ff] w-36  ">Path</Table.Th>
              <Table.Td>
                <Breadcrumbs
                  separator="→"
                  style={{
                    display: 'flex',
                    items: 'center',
                    flexWrap: 'wrap',
                    gap: '5px',
                  }}
                >
                  {parents.map((parent, index) => {
                    return (
                      <Text
                        key={parent.id}
                        span
                        onClick={() => {
                          setSelectedData(parent);
                          setParents(parents.slice(0, index + 1));
                        }}
                        className="cursor-pointer"
                      >
                        {parent.title}
                      </Text>
                    );
                  })}
                </Breadcrumbs>
              </Table.Td>
            </Table.Tr>

            <Table.Tr className="border-dashed border-2 ">
              <Table.Th className="bg-[#f1f1ff] w-36">Description</Table.Th>
              <Table.Td>
                <ScrollArea h={50}>
                  {selectedData.definition && (
                    <Text size="sm" className="rounded-md p-2">
                      {selectedData.definition}
                    </Text>
                  )}
                </ScrollArea>
              </Table.Td>
            </Table.Tr>
            <Table.Tr className="border-dashed border-2 ">
              <Table.Th className="bg-[#f1f1ff] w-36    ">Synonym</Table.Th>
              <Table.Td>
                <Text size="sm">{selectedData.synonym}</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="bg-[#f1f1ff] w-36  ">Acronym</Table.Th>
              <Table.Td className=" ">
                <Text size="sm">{selectedData.acronym}</Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        {children && children?.items && children?.items.length > 0 ? (
          <Table.ScrollContainer minWidth={500} type="native">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={'25%'}>Title</Table.Th>
                  <Table.Th w={'55%'}>Description</Table.Th>
                  <Table.Th w={'10%'}>Synonym</Table.Th>
                  <Table.Th w={'10%'}>Acronym</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : null}
      </ScrollArea>
    </>
  ) : (
    <></>
  );
};

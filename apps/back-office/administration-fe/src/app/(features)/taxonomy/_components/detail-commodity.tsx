import { Text, Table, ScrollArea } from '@mantine/core';
import { useState } from 'react';
import { useListQuery } from '../_api/taxonomy.api';

export const DetailCommodity = ({ selectedData, parents }: any) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const { data } = useListQuery({
    where: [
      [
        {
          column: 'code',
          value: selectedData?.code,
          operator: '=',
        },
      ],
    ],
  });
  const rows = data?.items?.map((element) => (
    <Table.Tr key={element.title}>
      <Table.Td>
        <Text size="sm">{`[${element.code}]:${
          element.title.slice(0, 30) + '...'
        }`}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" onClick={toggleShowMore} className="cursor-pointer">
          {element.definition &&
            (showMore
              ? element.definition
              : element.definition.slice(0, 70) + '...')}
          {element.definition && (
            <span className="text-xs">
              {' '}
              {showMore ? 'See Less' : 'See More'}
            </span>
          )}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{element.synonym}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{element.acronym}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return Object.keys(selectedData).length !== 0 ? (
    <>
      <ScrollArea h={400} type="scroll" scrollbarSize={6}>
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
                <Text size="xs">
                  {parents.map((parent, index) => {
                    return (
                      <Text key={parent.id} span>
                        {index != 0 && ' > '} {parent.title}
                      </Text>
                    );
                  })}
                </Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr className="border-dashed border-2 ">
              <Table.Th className="bg-[#f1f1ff] w-36">Description</Table.Th>
              <Table.Td>
                <ScrollArea h={50}>
                  <Text
                    size="sm"
                    className="border-solid border-2 border-[#b5b4ee] rounded-md"
                  >
                    {selectedData.definition && selectedData.definition}
                  </Text>
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
      </ScrollArea>
    </>
  ) : (
    <></>
  );
};

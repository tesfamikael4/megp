import {
  Avatar,
  Box,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  Skeleton,
} from '@mantine/core';
import { useGetReportsQuery } from '../../_api/reports';
import { IconFolder, IconBriefcase, IconFileCheck } from '@tabler/icons-react';
import { addSpacesToCamelCase } from '../../my-workspace/registration/_components/review/addSpaceToCamelCase';
import { InfoCard } from '../../my-workspace/_components/card';

const StatsPage = () => {
  const { data, isLoading, isFetching } = useGetReportsQuery({});
  const whitelist = [
    'activeVendors',
    'ibm',
    'marginalizedGroup',
    'debardVendors',
  ];
  if (isLoading || !data)
    return (
      <Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {whitelist.map((item) => (
          <Card shadow={'xs'} p={24} radius="md" key={item} h={'110px'}>
            <Flex>
              <Group className="flex-1">
                <Skeleton height={20} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} width="70%" radius="xl" />
              </Group>
              <Skeleton height={50} circle mb="xl" />
            </Flex>
          </Card>
        ))}
      </Group>
    );
  return (
    <>
      {data && (
        <Box mt={'md'}>
          <Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            {Object.keys(data).map((key) => {
              if (whitelist.includes(key))
                return (
                  <InfoCard
                    key={key}
                    icon={infoCard[key]}
                    title={addSpacesToCamelCase(key)}
                    count={data[key]}
                  />
                );
            })}
          </Group>
        </Box>
      )}
    </>
  );
};

export default StatsPage;

const infoCard = {
  ibm: (
    <Avatar color="#81D49A" variant="filled" radius={10}>
      <IconFolder size={32} stroke={1.5} className="text-white" />
    </Avatar>
  ),

  activeVendors: (
    <Avatar
      styles={{
        placeholder: {
          background: '#F6C488',
        },
      }}
      variant="filled"
      radius={10}
    >
      <IconBriefcase size={32} stroke={1.5} className="text-white" />
    </Avatar>
  ),

  marginalizedGroup: (
    <Avatar
      styles={{
        placeholder: {
          background: '#9CBEFF',
        },
      }}
      variant="filled"
      radius={10}
    >
      <IconFileCheck size={32} stroke={1.5} className="text-white" />
    </Avatar>
  ),

  debardVendors: (
    <Avatar
      styles={{
        placeholder: {
          background: '#fe435d',
        },
      }}
      variant="filled"
      radius={10}
    >
      <IconFileCheck size={32} stroke={1.5} className="text-white" />
    </Avatar>
  ),
};

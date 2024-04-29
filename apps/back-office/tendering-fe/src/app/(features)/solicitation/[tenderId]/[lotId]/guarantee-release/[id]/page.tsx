'use client';
import { DetailTable } from '@/app/(features)/_components/detail-table';
import { Box, Button, Container, Flex, Text, Textarea } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { Data } from '../../_components/data';

export default function ReleaseDetail() {
  const { tenderId, lotId } = useParams();
  const router = useRouter();
  return (
    <>
      <div className="bg-white -mt-4 -mr-4 -ml-4">
        <div className="container mx-auto ">
          <div className="pt-10 pb-10 text-black font-bold text-2xl flex justify-between">
            <Flex
              align="center"
              className="cursor-pointer "
              onClick={() =>
                router.push(`/solicitation/${tenderId}/${lotId}?tab=release`)
              }
            >
              <IconChevronLeft />
              <Text className="text-xl font-bold">{Data[0].value}</Text>
            </Flex>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">
        <Container fluid>
          <Box className=" bg-white w-full h-full">
            <Section title=" Guarantee Release Detail" collapsible={false}>
              <DetailTable data={Data} />
              <Flex justify="space-between" gap={10}>
                <Textarea className="mt-5 w-full" label="Remark" />
                <Textarea className="mt-5 w-full" label="Reason" />
              </Flex>
              <Flex justify="flex-end" gap={10}>
                <Button className="mt-5">Release</Button>
              </Flex>
            </Section>
          </Box>
        </Container>
      </Box>
    </>
  );
}

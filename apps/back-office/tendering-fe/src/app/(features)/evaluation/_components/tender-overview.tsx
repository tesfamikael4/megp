'use client';
import { useLazyGetTenderDetailQuery } from '@/store/api/tendering/tendering.api';
import { Badge, Box, Flex, LoadingOverlay, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const TenderOverView = ({ basePath }: { basePath: string }) => {
  const { tenderId } = useParams();
  const router = useRouter();
  const [getTender, { data, isLoading }] = useLazyGetTenderDetailQuery();

  useEffect(() => {
    getTender(tenderId as string);
  }, [tenderId]);
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Section
        title={
          <Flex
            justify="center"
            align="center"
            onClick={() => router.push(basePath)}
            className="cursor-pointer"
          >
            <IconChevronLeft size={14} />
            <Text className="font-semibold text-lg">
              Tender :
              <Text span className="font-normal text-lg">
                {' '}
                {data?.name ?? ''}
              </Text>
            </Text>
          </Flex>
        }
        subTitle={data?.procurementReferenceNumber ?? ''}
        collapsible={false}
      >
        <Flex gap={20}>
          <Box className="w-full">
            <Flex gap={5}>
              <Box>
                <Text fw={500} size="sm">
                  Envelope :
                </Text>
                <Text fw={500} size="sm">
                  Award Type :
                </Text>
              </Box>
              <Box>
                {data?.bdsSubmission?.envelopType && (
                  <Badge variant="outline" size="xs" color="gray">
                    {data?.bdsSubmission?.envelopType}
                  </Badge>
                )}
                <Text>
                  {data?.bdsEvaluation?.awardType && (
                    <Badge variant="outline" size="xs" color="gray">
                      {data?.bdsEvaluation?.awardType}
                    </Badge>
                  )}
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box className="w-full">
            <Flex gap={5}>
              <Box>
                <Text fw={500} size="sm">
                  Evaluation method :
                </Text>
                <Text fw={500} size="sm">
                  Status :
                </Text>
              </Box>
              <Box>
                <Text size="sm">
                  {data?.bdsEvaluation?.evaluationMethod && (
                    <Badge variant="outline" size="xs" color="gray">
                      {data?.bdsEvaluation?.evaluationMethod}
                    </Badge>
                  )}
                </Text>
                <Text size="sm">
                  {data?.status && (
                    <Badge variant="outline" size="xs" color="gray">
                      {data?.status}
                    </Badge>
                  )}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Section>
    </Box>
  );
};

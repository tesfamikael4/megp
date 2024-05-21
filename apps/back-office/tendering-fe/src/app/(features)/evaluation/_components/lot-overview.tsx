'use client';
import { useLazyGetLotDetailQuery } from '@/store/api/tendering/tendering.api';
import { Badge, Box, Flex, LoadingOverlay, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const LotOverview = ({
  basePath,
  teamAssessment = false,
}: {
  basePath: string;
  teamAssessment?: boolean;
}) => {
  const { tenderId, lotId } = useParams();
  const router = useRouter();
  const [getLot, { data, isLoading }] = useLazyGetLotDetailQuery();

  useEffect(() => {
    getLot({ tenderId: tenderId as string, lotId: lotId as string });
  }, [tenderId]);
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Section
        title={
          <Flex justify="center" align="center" className="cursor-pointer">
            <IconChevronLeft size={14} onClick={() => router.push(basePath)} />
            <Text
              className="font-semibold text-lg"
              onClick={() => router.push(basePath)}
            >
              Lot :{' '}
              <Text span className="font-normal text-lg">
                {data?.lots?.[0]?.name ?? ''}
              </Text>
            </Text>
            {teamAssessment && (
              <Badge className="ml-5" size="xs">
                Team Assessment
              </Badge>
            )}
          </Flex>
        }
        // subTitle={data?.procurementReferenceNumber ?? ''}
        collapsible={false}
      >
        <Flex gap={20}>
          <Box className="w-full">
            <Flex gap={5}>
              <Box>
                <Text fw={500} size="sm">
                  Tender :
                </Text>
                <Text fw={500} size="sm">
                  Envelope :
                </Text>
                <Text fw={500} size="sm">
                  Award Type :
                </Text>
              </Box>
              <Box>
                <p>{data?.name}</p>
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
                  Milestone :
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
                      {data?.lots?.[0]?.tenderMilestones?.[0]?.milestoneTxt?.replace(
                        /([a-z])([A-Z])/g,
                        '$1 $2',
                      )}
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

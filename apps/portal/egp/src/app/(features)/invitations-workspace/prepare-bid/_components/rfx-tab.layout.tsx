'use client';
import {
  Box,
  Text,
  useCombobox,
  LoadingOverlay,
  Select,
  Button,
  Flex,
  Stack,
  Badge,
} from '@mantine/core';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  useGetAllLotsQuery,
  useTenderDetailQuery,
} from '../../../_api/registration.api';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronUp,
} from '@tabler/icons-react';
import { useRfxDetailQuery } from '@/app/(features)/my-workspace/_api/invitation-registration.api';
import { DetailTable } from '@/app/(features)/_components/detail-table/detail-table';

export default function RfxDetailTabs({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const paths = pathname?.split('/');
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { rfxId } = useParams();
  const { data: selected, isLoading } = useRfxDetailQuery(rfxId?.toString());
  const prepareBidContext = useContext(PrepareBidContext);
  const activeTabStyle =
    'cursor-pointer border-l bg-[#F5FBFE] pointer text-gray-700 border-t border-r border-[#bbe5fb] rounded-tl-md rounded-tr-md py-2 px-20 font-medium text-center';
  const inactiveTabStyle =
    'cursor-pointer pointer text-gray-700 py-2 px-20 font-medium text-center';
  const [showMore, handleShowMore] = useState(false);
  const submissionDeadline = selected?.rfxBidProcedure?.submissionDeadline
    ? new Date(
        selected?.rfxBidProcedure?.submissionDeadline,
      ).toLocaleDateString()
    : '';

  // Helper function to get the time difference in seconds
  const getTimeDifference = (date1: Date, date2: Date) =>
    Math.floor((date2.getTime() - date1.getTime()) / 1000);

  // Timer component
  const Timer = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState(
      getTimeDifference(new Date(), targetDate),
    );

    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(getTimeDifference(new Date(), targetDate));
      }, 1000);

      return () => clearTimeout(timer);
    }, [targetDate, timeLeft]);

    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
      return `${formattedMinutes} mins: ${formattedSeconds} secs`;
    };

    return <div>{formatTime(timeLeft)}</div>;
  };

  const config = [
    {
      key: 'Opening Date',
      value: submissionDeadline,
    },
    {
      key: 'Round',
      value: selected?.rfxBidProcedure?.round,
    },
    {
      key: 'Minimum Bid Decrement (in %)',
      value: `${selected?.rfxBidProcedure?.minimumBidDecrementPercentage} %`,
    },
    {
      key: 'Round Duration',
      value: `${selected?.rfxBidProcedure?.roundDuration} mins`,
    },
    {
      key: 'Idle Time',
      value: `${selected?.rfxBidProcedure?.idleTime} mins`,
    },
  ];

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <div className="bg-white">
        <div className="container mx-auto ">
          <Stack>
            <div className="pt-10  text-black font-bold text-2xl flex justify-between">
              <Flex className="items-center gap-2">
                <IconChevronLeft
                  className="cursor-pointer"
                  onClick={() => router.push(`/my-workspace/my-invitations`)}
                />
                <Box>{selected?.name}</Box>
              </Flex>
              <Flex className="gap-4">
                {selected?.rfxBidProcedure && (
                  <Timer
                    targetDate={
                      new Date(selected?.rfxBidProcedure?.submissionDeadline)
                    }
                  />
                )}
                <Button
                  variant="filled"
                  className="my-auto"
                  onClick={() => {
                    sessionStorage.removeItem('password');
                    router.push(
                      `/invitations-workspace/${rfxId}/check-password`,
                    );
                  }}
                >
                  Release Key
                </Button>
              </Flex>
            </div>
            <Stack className="ml-8 mb-6">
              <Flex className="items-center gap-4">
                <Text>Submission Deadline: </Text>
                <Badge variant="outline">{submissionDeadline}</Badge>
              </Flex>
              <Badge
                onClick={() => {
                  handleShowMore(!showMore);
                }}
                leftSection={showMore ? <IconChevronUp /> : <IconChevronDown />}
                className="cursor-pointer"
              >
                {showMore ? 'See Less' : 'See More'}
              </Badge>
              {showMore && <DetailTable data={config} />}
            </Stack>
          </Stack>
          <div className="flex">
            <div>
              <div className="flex space-x-4">
                {
                  <>
                    <Text
                      className={
                        paths.includes('bid-declaration')
                          ? activeTabStyle
                          : inactiveTabStyle
                      }
                      onClick={() => {
                        router.push(
                          `/invitations-workspace/prepare-bid/${rfxId}/bid-declaration`,
                        );
                      }}
                    >
                      Documentary Evidences
                    </Text>
                    <Text
                      className={
                        paths.includes('price-schedule')
                          ? activeTabStyle
                          : inactiveTabStyle
                      }
                      onClick={() => {
                        router.push(
                          `/invitations-workspace/prepare-bid/${rfxId}/price-schedule`,
                        );
                      }}
                    >
                      Price Schedule
                    </Text>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">{children}</Box>
    </>
  );
}

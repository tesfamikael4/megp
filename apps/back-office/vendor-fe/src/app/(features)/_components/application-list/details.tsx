'use client';
import {
  useGetApplicationRequestDetailByIdQuery,
  usePickTaskMutation,
  useUnpickTaskMutation,
} from '@/store/api/vendor_request_handler/new-registration-api';
import {
  Avatar,
  Box,
  Flex,
  Text,
  Paper,
  Button,
  Skeleton,
} from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconClockHour2, IconTicket, IconProgress } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import TaskHandler from '@/app/(features)/_components/task-handler';
import { notifications } from '@mantine/notifications';
import TaskDetails from '@/app/(features)/_components/task-details';
import { formatDateTimeFromString, processCompanyName } from '../../util';

export default function RequestDetail({
  requestType,
}: {
  requestType: 'new' | 'upgrade' | 'renewal' | 'update' | 'preferential';
}) {
  const { instanceId } = useParams();
  const [isPicked, setIsPicked] = useState(false);
  const [taskType, setTaskType] = useState<string>();
  const [content, setContent] = useState<'details' | 'tasks'>('tasks');
  const [tracker, setTaskTracker] = useState<any>();
  const pickLabel = isPicked ? 'Unpick' : 'Pick';
  const router = useRouter();

  const response = useGetApplicationRequestDetailByIdQuery({
    instanceId: instanceId as string,
  });
  const [pickTask, { isLoading: isPicking }] = usePickTaskMutation();
  const [unPickTask, { isLoading: isUnPicking }] = useUnpickTaskMutation();
  const [hideUnPick, setHideUnPick] = useState<boolean>(false);

  if (!response || response.isLoading) {
    return (
      <Paper className="p-5">
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={10} radius="xl" />
        <Skeleton height={8} mt={10} width="70%" radius="xl" />
      </Paper>
    );
  } else if (
    response.error &&
    'status' in response.error &&
    response.error.status === 404
  ) {
    router.push(
      `/${
        requestType === 'update'
          ? 'info-change'
          : requestType === 'preferential'
            ? 'preferential-services'
            : requestType
      }`,
    );
    return null;
  }

  const handlePickButton = () => {
    const taskHandler = {
      id: response.data.id,
      taskId: response.data.taskHandler.taskId,
      instanceId: response.data.taskHandler.instanceId,
    };

    if (isPicked) {
      unPickTask(taskHandler).then(() => {
        setIsPicked(!isPicked);
        notifications.show({
          title: 'Success',
          message: 'Task has been unpicked.',
          color: 'green',
        });
      });
    } else {
      pickTask(taskHandler).then(() => {
        setIsPicked(!isPicked);
        notifications.show({
          title: 'Success',
          message: 'Task has been picked.',
          color: 'green',
        });
      });
    }
  };
  const { initials, color } = processCompanyName(
    response.data?.isrvendor?.basic.name,
  );

  return (
    <>
      <Paper className="p-3">
        <Flex direction="row" className="items-center">
          <Flex direction="row" className="w-8/12">
            <Box className="p-3">
              <Avatar color="white" radius="xl" size="lg" bg={color}>
                {initials}
              </Avatar>
            </Box>
            <Flex
              direction="column"
              className="w-full border-r-[1px] text-sm justify-center"
            >
              <Box className="text-primary-800 font-bold" size="xl">
                {response.data.isrvendor?.basic.name}
              </Box>
              <Box>Country: {response.data.isrvendor?.basic.origin}</Box>
            </Flex>
          </Flex>
          <Flex direction="column" className="border-l-gray-50 w-4/12 ml-3">
            <Flex direction="row" className="items-center gap-1 text-sm">
              <IconTicket size={18} />
              <Box>{response.data.applicationNumber}</Box>
            </Flex>
            <Flex direction="row" className="items-center gap-1 text-sm">
              <IconClockHour2 size={18} />
              <Box>{formatDateTimeFromString(response?.data?.submittedAt)}</Box>
            </Flex>
            <Flex direction="row" className="items-center gap-1 text-sm">
              <IconProgress size={18} />
              <Box>
                {response.data.status === 'Inprogress'
                  ? 'In progress'
                  : 'Completed'}
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Paper>
      <Box className="mt-3">
        <Flex gap={'sm'}>
          {content === 'tasks' && (
            <Box className="w-1/2">
              <Section
                collapsible={false}
                title="Completed Tasks"
                className="h-fit"
                mh={'300px'}
              >
                {[...response.data.taskTrackers]
                  .reverse()
                  .map((tracker, index) => (
                    <Box
                      key={index}
                      className={`p-3 cursor-pointer hover:bg-gray-300 text-sm ${
                        index % 2 === 0 ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        setTaskTracker(tracker);
                        setContent('details');
                      }}
                    >
                      {response.data.taskTrackers.length - index} -{' '}
                      {tracker.task.label}
                    </Box>
                  ))}
              </Section>
            </Box>
          )}
          {content === 'details' && (
            <Box className="w-1/2 min-h-400">
              <TaskDetails
                tracker={tracker}
                setContent={setContent}
                data={{
                  ...response.data?.isrvendor,
                  preferential: response.data?.preferential ?? {},
                  profileUpdate: response.data?.profileUpdate ?? {},
                  upgrade: response.data?.upgrade ?? {},
                  renewal: response.data?.renewal ?? {},
                }}
                uniqueTabs={
                  requestType === 'preferential'
                    ? [
                        {
                          tabValue: 'preferential',
                          tabName: 'Preferential Treatment',
                        },
                      ]
                    : requestType === 'upgrade'
                      ? [
                          {
                            tabValue: 'upgrade',
                            tabName: 'Upgrade Request',
                          },
                        ]
                      : requestType === 'renewal'
                        ? [
                            {
                              tabValue: 'renewal',
                              tabName: 'Renewal Request',
                            },
                          ]
                        : []
                }
              />
            </Box>
          )}
          <Box className="w-1/2 min-h-[400px]">
            <Section
              collapsible={false}
              title="Current Task"
              className="w-1/2"
              mh={'300px'}
            >
              <Flex className="text-sm bg-gray-100 p-3" justify="space-between">
                {hideUnPick ? (
                  <>
                    <Box>
                      <Box className="text-primary-800 font-semibold">
                        Task Completed
                      </Box>
                    </Box>
                    <Button
                      onClick={() => {
                        return router.push(
                          requestType === 'update'
                            ? '/info-change'
                            : requestType === 'preferential'
                              ? 'preferential-service'
                              : `/${requestType}`,
                        );
                      }}
                    >
                      Go Back To List
                    </Button>{' '}
                  </>
                ) : (
                  <>
                    <Box>
                      <Box className="text-primary-800 font-semibold">
                        {response.data.task.name}
                      </Box>
                      <Box>{response.data.task.description}</Box>
                    </Box>
                    <Button
                      className="overflow-visible"
                      onClick={() => {
                        handlePickButton();
                        setTaskType(response.data.task.taskType);
                      }}
                      loading={isPicking || isUnPicking}
                    >
                      {pickLabel}
                    </Button>
                  </>
                )}
              </Flex>
              {isPicked && (
                <TaskHandler
                  taskType={taskType}
                  instanceID={response.data.id}
                  taskCheckLists={response.data.task.taskCheckList}
                  setIsPicked={setIsPicked}
                  requesterID={response.data.requestorId}
                  requestType={requestType}
                  setHideUnPick={setHideUnPick}
                />
              )}
            </Section>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

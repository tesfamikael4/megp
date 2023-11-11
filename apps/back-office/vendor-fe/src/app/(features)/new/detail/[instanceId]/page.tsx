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
import { useParams } from 'next/navigation';
import { useState } from 'react';
import TaskHandler from '@/app/(features)/_components/task-handler';
import { notifications } from '@mantine/notifications';
import TaskDetails from '@/app/(features)/_components/task-details';

export default function NewRequestDetail() {
  const { instanceId } = useParams();
  const [isPicked, setIsPicked] = useState(false);
  const [taskType, setTaskType] = useState<string>();
  const [content, setContent] = useState<'details' | 'tasks'>('tasks');
  const [tracker, setTaskTracker] = useState<any>();
  const pickLabel = isPicked ? 'Unpick' : 'Pick';

  const response = useGetApplicationRequestDetailByIdQuery({
    instanceId: instanceId as string,
  });
  const [pickTask, { isLoading: isPicking }] = usePickTaskMutation();
  const [unPickTask, { isLoading: isUnPicking }] = useUnpickTaskMutation();

  if (!response || !response.data) {
    return (
      <Paper className="p-5">
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={10} radius="xl" />
        <Skeleton height={8} mt={10} width="70%" radius="xl" />
      </Paper>
    );
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

  return (
    <>
      <Paper className="p-3">
        <Flex direction="row" className="items-center">
          <Flex direction="row" className="w-8/12">
            <Box className="p-3">
              <Avatar color="cyan" radius="xl" size="lg">
                {response.data?.vendor.name?.charAt(0)}
              </Avatar>
            </Box>
            <Flex direction="column" className="w-full border-r-2">
              <Text className="text-primary-800 font-bold" size="xl">
                Vendor: {response.data.vendor.name}
              </Text>
              <Text>Requester: {response.data.vendor.name}</Text>
              <Text>Vendor Type: {response.data.vendor.origin}</Text>
            </Flex>
          </Flex>
          <Flex direction="column" className="border-l-gray-200 w-4/12 ml-3">
            <Flex direction="row" className="items-center gap-1">
              <IconTicket size={18} />
              <Text>{response.data.applicationNumber}</Text>
            </Flex>
            <Flex direction="row" className="items-center gap-1">
              <IconClockHour2 size={18} />
              <Text>{response.data?.submittedAt?.split('T')[0]}</Text>
            </Flex>
            <Flex direction="row" className="items-center gap-1">
              <IconProgress size={18} />
              <Text>
                {response.data.status === 'Inprogress'
                  ? 'In progress'
                  : 'Completed'}
              </Text>
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
              >
                {[...response.data.taskTrackers]
                  .reverse()
                  .map((tracker, index) => (
                    <Box
                      key={index}
                      className={`text-base p-3 cursor-pointer hover:bg-gray-300 ${
                        index % 2 === 0 ? 'bg-gray-200' : ''
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
            <Box className="w-1/2">
              <TaskDetails tracker={tracker} setContent={setContent} />
            </Box>
          )}
          <Box className="w-1/2">
            <Section
              collapsible={false}
              title="Current Task"
              className="h-fit w-1/2"
              action={
                <Button
                  onClick={() => {
                    handlePickButton();
                    setTaskType(response.data.task.taskType);
                  }}
                  loading={isPicking || isUnPicking}
                >
                  {pickLabel}
                </Button>
              }
            >
              <Box className="text-base bg-gray-100 p-3">
                <Text className="text-primary-800">
                  Task: {response.data.task.name}
                </Text>
                <Text>Description: {response.data.task.description}</Text>
              </Box>
              {isPicked && (
                <TaskHandler
                  taskType={taskType}
                  instanceID={response.data.id}
                  taskCheckLists={response.data.task.taskCheckList}
                  setIsPicked={setIsPicked}
                />
              )}
            </Section>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

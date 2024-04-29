'use client';
import {
  useGetApplicationRequestDetailByIdQuery,
  usePickTaskMutation,
  useUnpickTaskMutation,
} from '@/store/api/vendor_request_handler/new-registration-api';
import { Avatar, Box, Flex, Paper, Button, Skeleton } from '@mantine/core';
import { Section, logger } from '@megp/core-fe';
import { IconClockHour2, IconTicket, IconProgress } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TaskHandler from '@/app/(features)/_components/task-handler';
import { notifications } from '@mantine/notifications';
import TaskDetails from '@/app/(features)/_components/task-details';
import { formatDateTimeFromString, processCompanyName } from '../../util';
import { PDFHighlighter } from '../pdf-highlighter/pdf-highlighter';
import { getCookie } from 'cookies-next';
import { GeneratePdf } from '../generatePdf';

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
  logger.log(tracker);
  const pickLabel = isPicked ? 'Unpick' : 'Pick';
  const router = useRouter();
  const response = useGetApplicationRequestDetailByIdQuery({
    instanceId: instanceId as string,
  });

  const vendorInfo =
    requestType !== 'update'
      ? response.data?.isrvendor
      : {
          ...response.data?.profileUpdate?.profileData,
          ...response.data?.profileUpdate?.profileData?.basic,
        };

  const [fileUrl, setFileUrl] = useState('');
  useEffect(() => {
    const getFile = async (url) => {
      const newURl = `${
        process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'
      }upload/get-file-bo/application-doc/${url}/${vendorInfo?.userId}`;

      try {
        const token = getCookie('token');
        const response = await fetch(newURl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching file');
        }
        const fileBlob = await response.blob();
        // const blobType = fileBlob.type;

        setFileUrl(URL.createObjectURL(fileBlob));
      } catch (error) {
        logger.log(error);
      }
    };
    void getFile(response?.data?.taskHandler?.data?.documentId);
  }, [response?.data?.taskHandler?.data?.documentId, vendorInfo?.userId]);

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

  const currentVendor = response.data?.isrvendor;
  const vendorDetails = {
    ...(requestType !== 'update'
      ? tracker?.data
      : {
          ...response.data?.profileUpdate?.profileData,
          ...response.data?.profileUpdate?.profileData?.basic,
        }),
    preferential: response.data?.preferential ?? {},
    upgrade: response.data?.upgrade ?? {},
    renewal: response.data?.renewal ?? {},
  };
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
  const { initials, color } = processCompanyName(currentVendor?.basic.name);

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
                {currentVendor?.basic.name}
              </Box>
              <Box>Country: {currentVendor?.basic.origin}</Box>
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
          {!isPicked || (response.data && taskType === 'Certificate') ? (
            <>
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
                        <>
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
                            {index + 1} - {tracker.task.label}
                          </Box>
                        </>
                      ))}
                  </Section>
                </Box>
              )}
              {content === 'details' && (
                <Box className="w-1/2 min-h-400">
                  <TaskDetails
                    tracker={tracker}
                    setContent={setContent}
                    data={vendorDetails}
                    isPicked={isPicked}
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
                  <Flex
                    className="text-sm bg-gray-100 p-3"
                    justify="space-between"
                  >
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
                  {taskType === 'Certificate' && (
                    <Flex gap="md">
                      <GeneratePdf
                        label="Download Certificate"
                        id={`${response.data.requestorId as string}/${response.data.id as string}`}
                        className=""
                        mode="view"
                        apiUrl={`${process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'}`}
                        setHideUnPick={setHideUnPick}
                      />
                    </Flex>
                  )}
                </Section>
              </Box>
            </>
          ) : (
            <Box className="w-full">
              <Flex align={'center'} justify={'flex-end'} className="py-2">
                <Button
                  onClick={() => {
                    setContent('tasks');
                    handlePickButton();
                  }}
                >
                  Back
                </Button>
              </Flex>
              <PDFHighlighter
                title={response?.data?.taskHandler?.data?.documentId}
                objectId={response?.data?.user?.id}
                pdfUrl={fileUrl}
                workflow={
                  <TaskHandler
                    taskType={taskType}
                    instanceID={response.data.id}
                    taskCheckLists={response.data.task.taskCheckList}
                    setIsPicked={setIsPicked}
                    requesterID={response.data.requestorId}
                    requestType={requestType}
                    setHideUnPick={setHideUnPick}
                    isrVendor={requestType === 'new' && currentVendor}
                  />
                }
              />
            </Box>
          )}
        </Flex>
      </Box>
    </>
  );
}

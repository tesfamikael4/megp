'use client';
import { useParams } from 'next/navigation';
import { Table, Tabs, Button, Text, Tooltip, Box, Avatar } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import classes from '../completed/sidebar.module.scss';
import PaymentPage from '../current/Payment';
import { GeneratePdf, Section } from '@megp/core-fe';
import { useEffect, useState } from 'react';
import ReviewVendorRequest from '../current/review-vendor-request';
import TicketIcon from '../_shared/icons/Ticket';
import TimeIcon from '../_shared/icons/Time';
import {
  useGetApplicationRequestDetailByIdQuery,
  usePickTaskMutation,
  useUnpickTaskMutation,
} from '@/store/api/vendor_request_handler/new_registration_query';

import InvoicePage from '../current/Invoice';

import styles from '../../vendor-requests/requests.module.scss';

import ConfirmationPage from '../current/confirmation';

import { TasksDetailsPage } from '../completed/tasks-details';

export default function ClientPage12() {
  const { instanceId } = useParams();
  const [isPicked, setIsPicked] = useState(true);
  const [selectedTracker, setSelectedTracker] = useState<any>(null);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isTabSelected, setSelectedTab] = useState(false);

  const [pickMutate] = usePickTaskMutation();
  const [unPickMutate] = useUnpickTaskMutation();
  const [remark, setRemark] = useState('');

  const handleRemarkChange = (newRemark) => {
    setRemark(newRemark);
  };

  const response = useGetApplicationRequestDetailByIdQuery({
    instanceId: instanceId as string,
  });

  const [assignmentStatus, setAssignmentStatus] = useState(
    response.data?.taskHandler?.assignmentStatus,
  ); // Initialize with an initial value

  const handlePickButtonClick = async () => {
    const taskHandler = {
      id: response.data?.id,
      taskId: response.data.taskHandler?.taskId,
      instanceId: response.data.taskHandler?.instanceId,
    };
    try {
      let response;
      let successMessage;

      if (isPicked) {
        response = await pickMutate(taskHandler);
        setAssignmentStatus(response.data?.taskHandler?.assignmentStatus);
        setIsPicked(false);
        successMessage = 'Task picked successfully';
      } else {
        response = await unPickMutate(taskHandler);
        setAssignmentStatus(response.data?.taskHandler?.assignmentStatus);
        setIsPicked(true);
        successMessage = 'Task unpicked';
      }

      notifications.show({
        message: <Text>{successMessage}</Text>,
        autoClose: 3500,
      });
    } catch (error) {
      // Handle errors
    }
  };

  const [tabContentVisibility, setTabContentVisibility] = useState<boolean[]>(
    [],
  );

  useEffect(() => {
    if (response && response.data && response.data.taskTrackers) {
      // Set the initial state once when response.data is available
      setTabContentVisibility(
        new Array(response.data.taskTrackers.length).fill(false),
      );
    }
  }, [response]);
  const handleBackButton = () => {
    setSelectedTabIndex(0); // Deselect the tab
    setSelectedTab(false);
  };
  const toggleTabContent = (index, tracker) => {
    setSelectedTab(true);
    setSelectedTabIndex(index);
    setSelectedTracker(tracker);
  };
  const buttonLabel = isPicked ? 'Pick' : 'Unpick';

  const renderComponent = () => {
    if (!response.data) return null;

    if (
      response.data.task.taskType ===
      'Submission of New Vendor Registration Request'
    ) {
      return (
        <GeneratePdf
          label="Cerficate"
          selector="#qr"
          templateUrl="http://192.168.137.22:5500/verify/vendors/544544212"
          className=""
          mode="view"
          apiUrl="http://192.168.1.27:3000/api/"
        />
      );
    }

    if (assignmentStatus === 'Picked') {
      if (
        response.data.task.taskType === 'ISR' ||
        response.data.task.taskType === 'Approval'
      ) {
        return (
          <ReviewVendorRequest
            instanceId={response.data.id}
            remark={remark}
            onRemarkChange={handleRemarkChange}
            taskCheckLists={response.data?.task?.taskCheckList || []}
          />
        );
      } else if (response.data.task.taskType === 'Invoice') {
        return <InvoicePage instanceId={response.data.id} />;
      } else if (response.data.task.taskType === 'Confirmation') {
        return (
          <ConfirmationPage
            instanceId={response.data.id}
            remark={remark}
            onRemarkChange={handleRemarkChange}
            taskCheckLists={response.data?.task?.taskCheckList || []}
          />
        );
      } else if (response.data.task.taskType === 'Certificate') {
        return (
          <GeneratePdf
            label="Cerficate"
            selector="#qr"
            templateUrl="http://192.168.137.22:5500/verify/vendors/544544212"
            className=""
            mode="view"
            apiUrl="http://192.168.1.27:3000/api/"
          />
        );
      }
    }

    return null;
  };

  const componentToRender = renderComponent();

  <Box>{response.data ? componentToRender : <Box></Box>}</Box>;

  return (
    <Box>
      <Box>
        <Table>
          <Table.Tbody>
            <Table.Tr style={{ backgroundColor: '#FFFFFF' }}>
              <Table.Th className={classes.content}>
                <Box className={classes.innerContent}>
                  <Box className="flex items-center">
                    <Text component="strong">
                      <Avatar color="cyan" radius="xl" size="lg">
                        {response.data?.vendor?.name?.charAt(0)}
                      </Avatar>
                    </Text>
                  </Box>

                  <Box>
                    <Text className={styles.taskName}>
                      Vendor: {response.data && response.data.vendor?.name}
                      <br />
                    </Text>
                    <Text>
                      Requester:
                      {response.data && response.data.vendor?.name}
                      <br />
                    </Text>
                    <Text>
                      Vendor Type:
                      {response.data && response.data.vendor?.origin}
                    </Text>
                  </Box>
                </Box>
              </Table.Th>
              <Table.Th>
                <Box className={styles.row_icons}>
                  <Tooltip label="Application number">
                    <Box>
                      <TicketIcon />
                    </Box>
                  </Tooltip>
                  <Box>
                    <Text>
                      {response.data && response.data.applicationNumber}
                    </Text>
                  </Box>
                </Box>
                <Box className={styles.row_icons}>
                  <Tooltip label="Request date">
                    <Box>
                      <TimeIcon />
                    </Box>
                  </Tooltip>
                  <Box>
                    <Text>
                      {response.data &&
                        response.data?.submittedAt?.split('T')[0]}
                    </Text>
                  </Box>
                </Box>
              </Table.Th>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
      <Box className={classes.formWrapper}>
        {isTabSelected ? (
          <Box className={classes.completed}>
            <Box>
              <Section
                title={selectedTracker?.task?.label}
                collapsible={false}
                action={<Button onClick={handleBackButton}>Back</Button>}
              >
                <TasksDetailsPage tracker={selectedTracker} />
              </Section>
            </Box>
          </Box>
        ) : (
          <Box className={classes.completed}>
            <Section title="Completed Tasks" collapsible={false}>
              <Box className={classes.tabWrapper}>
                {response.data &&
                  response.data.taskTrackers.map((tracker, index) => (
                    <Box key={index}>
                      <Box
                        key={index}
                        className={`${classes.normaltab} ${
                          selectedTabIndex === index ? classes.selectedTab : ''
                        } ${
                          index % 2 === 0
                            ? classes.greyBackground
                            : classes.whiteBackground
                        }`}
                      >
                        <Tabs
                          onClick={() => toggleTabContent(index, tracker)}
                          className={classes.pointer}
                        >
                          <Text>
                            {response.data.taskTrackers.length - index} -{' '}
                            {tracker.task && tracker.task.label}
                          </Text>
                        </Tabs>
                      </Box>

                      {tabContentVisibility[index] && (
                        <Box>
                          {tracker.task &&
                            tracker.task.taskType === 'Invoice' && (
                              <InvoicePage instanceId={tracker} />
                            )}
                          {tracker.task &&
                            tracker.task.taskType === 'Payment' && (
                              <PaymentPage />
                            )}
                          {tracker.task &&
                            tracker.task.taskType === 'Certificate' && (
                              <PaymentPage />
                            )}
                        </Box>
                      )}
                    </Box>
                  ))}
              </Box>
              <Box></Box>
            </Section>
          </Box>
        )}
        <Box className={classes.current}>
          <Section
            title="Current Task"
            collapsible={false}
            action={
              <Button onClick={handlePickButtonClick}>{buttonLabel}</Button>
            }
          >
            <Box>
              <Table>
                <Table.Tbody>
                  <Table.Tr
                    style={{ backgroundColor: '#F3F4F6' }}
                    className={styles['table-row']}
                  >
                    <Table.Th className={classes.content}>
                      <Box className={classes.innerContent}>
                        <Box>
                          <Text style={{ color: '#4267b2' }}>
                            Task:
                            {response.data && response.data.task?.name}
                          </Text>

                          <Text>
                            Description:
                            {response.data && response.data.task?.description}
                          </Text>
                        </Box>
                      </Box>
                    </Table.Th>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Box>
            <Box className={classes.taskType}>{componentToRender}</Box>
          </Section>
        </Box>
      </Box>
    </Box>
  );
}

'use client';
import {
  Accordion,
  Box,
  Button,
  Flex,
  Group,
  Skeleton,
  Stack,
  Stepper,
  Textarea,
  Text,
  Menu,
  Avatar,
  Paper,
} from '@mantine/core';
import { Section } from '@megp/core-fe';
import { useEffect, useState } from 'react';
import { IconArrowBackUp } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@megp/auth';
import { useLazyGetGroupQuery } from '@/store/api/planning-approval/planning-iam';
import {
  useGetCurrentWorkflowInstanceQuery,
  useLazyGetNotesQuery,
} from '@/store/api/workflow/workflow.api';
import {
  useGetStepsQuery,
  useGoToMutation,
  useApproveMutation,
} from '@/store/api/workflow/workflow.api';

export function WorkflowHandling({
  itemId,
  itemKey,
}: {
  itemId: string;
  itemKey: string;
}) {
  const { userCall, user } = useAuth();
  const [active, setActive] = useState(0);
  const [steps, setSteps] = useState<Record<string, any>[]>([]);
  const [currentStep, setCurrentStep] = useState<Record<string, any>>({});
  const [group, setGroup] = useState<any>();
  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState('');

  const [getGroup, { data: groupData }] = useLazyGetGroupQuery();
  const [approve, { isLoading: isApproving }] = useApproveMutation();
  const [goToStep, { isLoading: isGoing }] = useGoToMutation();

  const { data: currentStepData } = useGetCurrentWorkflowInstanceQuery({
    itemId: itemId,
    key: itemKey,
  });
  const { data: stepsList } = useGetStepsQuery({
    itemId: itemId,
    key: itemKey,
  });

  useEffect(() => {
    if (user) {
      getGroup({ userId: user?.organizations?.[0].userId });
    }
  }, [user]);

  useEffect(() => {
    setGroup(groupData?.items);
  }, [groupData]);

  useEffect(() => {
    if (currentStep?.status === 'Approved') {
      setActive(currentStep?.instanceStep?.order);
    } else {
      setActive(currentStep?.instanceStep?.order - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    setCurrentStep(currentStepData);
  }, [currentStepData]);

  useEffect(() => {
    setSteps(stepsList?.items);
  }, [stepsList]);

  const handleApprove = async () => {
    if (!remark) {
      setRemarkError('Please add a remark.');
      return;
    }
    try {
      await approve({
        metaData: {
          name: currentStep?.instanceStep?.name.split(' ').join(''),
          action: 'Approved',
          remark: remark,
          approver: `${user?.firstName} ${user?.lastName}`,
          userId: user?.id,
        },
        itemId: itemId,
        activityId: currentStep?.instanceStep?.activityId,
        instanceId: currentStep?.id,
      }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Approved successfully.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error approving.',
        color: 'red',
      });
    }
  };

  const handleAdjust = async () => {
    if (!remark) {
      setRemarkError('Please add a remark.');
      return;
    }
    try {
      await approve({
        metaData: {
          name: currentStep?.instanceStep?.name.split(' ').join(''),
          action: 'reject',
          remark: remark,
          approver: `${user?.firstName} ${user?.lastName}`,
          userId: user?.id,
        },
        itemId: itemId,
        activityId: currentStep?.instanceStep?.activityId,
        instanceId: currentStep?.id,
      }).unwrap();

      notifications.show({
        title: 'Success',
        message: 'Submitted for adjustment successfully.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error adjusting.',
        color: 'red',
      });
    }
  };

  const handleGoTo = async (stepId, stepName) => {
    if (!remark) {
      setRemarkError('Please add a remark.');
      return;
    }
    try {
      await goToStep({
        details: {
          name: currentStep?.instanceStep?.name.split(' ').join(''),
          action: 'reject',
          remark: remark,
          approver: `${user?.firstName} ${user?.lastName}`,
          userId: user?.id,
        },
        itemId: itemId,
        activityId: currentStep?.instanceStep?.activityId,
        instanceId: currentStep?.id,
        goto: { id: stepId, status: stepName },
      }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Approved successfully.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error rejecting.',
        color: 'red',
      });
    }
  };

  function checkIdStepIdExist(currentStep, targetId, targetStepId) {
    return currentStep?.metadata?.some(
      (entry) =>
        entry.userId === targetId &&
        entry.stepId === targetStepId &&
        currentStep?.version === entry.version,
    );
  }

  function checkUserGroup() {
    return group?.some(
      (entry) => entry.groupId === currentStep?.instanceStep?.approvers[0].id,
    );
  }

  function getMetaData(currentStep, stepId, key) {
    return currentStep?.find((e) => e.instanceStepId === stepId)[key];
  }

  function getPreviousSteps(stepId) {
    return steps.filter((step) => step.order < stepId);
  }

  return (
    <Flex gap="md">
      <Box className="min-w-full">
        <Section title="Approval Workflow" collapsible={false}>
          <Flex gap="md">
            <Stepper
              active={active}
              orientation="vertical"
              iconSize={30}
              className="min-w-full"
              allowNextStepsSelect={false}
              color="green"
              styles={{
                stepBody: {
                  minWidth: '90%',
                },
              }}
            >
              {!steps && (
                <>
                  <Skeleton height={50} circle mb="xl" />
                  <Skeleton height={8} radius="xl" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                </>
              )}
              {steps &&
                steps?.map((step, index) => {
                  return (
                    <Stepper.Step
                      key={index}
                      label={step.name}
                      allowStepSelect={false}
                      className="w-full"
                      description={
                        <>
                          <Stack className="min-w-full">
                            {step?.order < currentStep?.instanceStep?.order ? (
                              <Accordion
                                className="min-w-full"
                                styles={{
                                  control: {
                                    outline: '1px solid white',
                                    paddingLeft: '0px',
                                  },
                                }}
                              >
                                <Accordion.Item
                                  value={`Approved by ${step.approvers[0].approver}`}
                                >
                                  <Accordion.Control>
                                    <Text c="#868e96">{`Approved by ${step.approvers[0].approver}`}</Text>
                                  </Accordion.Control>
                                  <Accordion.Panel className="w-full">
                                    Remark:{' '}
                                    {
                                      currentStep?.metadata.find(
                                        (e) => e.stepId === step.id,
                                      )?.remark
                                    }
                                  </Accordion.Panel>
                                  <Accordion.Panel>
                                    {getMetaData(
                                      currentStep?.metaData,
                                      step.id,
                                      remark,
                                    )}
                                  </Accordion.Panel>
                                </Accordion.Item>
                              </Accordion>
                            ) : (
                              <Text>{`Approval by ${step.approvers[0].approver}`}</Text>
                            )}
                            {currentStep?.instanceStepId === step.id &&
                              currentStep.status != 'Approved' &&
                              !checkIdStepIdExist(
                                currentStep,
                                user?.organizations?.[0].userId,
                                step.id,
                              ) &&
                              (userCall?.organizations?.[0]?.roles?.some(
                                (role) =>
                                  role?.id ==
                                  currentStep?.instanceStep?.approvers?.[0]?.id,
                              ) ||
                                user?.organizations?.[0].userId ===
                                  currentStep?.instanceStep?.approvers[0].id ||
                                checkUserGroup()) && (
                                <>
                                  <Textarea
                                    withAsterisk
                                    minRows={3}
                                    maxRows={5}
                                    autosize
                                    label="Remark"
                                    placeholder="Please enter your remarks"
                                    value={remark}
                                    onChange={(e) => {
                                      setRemarkError('');
                                      setRemark(e.target.value);
                                    }}
                                    className="max-w-[80%]"
                                    error={remarkError}
                                  />
                                  <Group>
                                    <Button
                                      onClick={async () => {
                                        await handleApprove();
                                      }}
                                      loading={isApproving}
                                      className="bg-green-500"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      className="bg-yellow-500"
                                      onClick={async () => {
                                        await handleAdjust();
                                      }}
                                    >
                                      Adjust
                                    </Button>
                                    <Menu>
                                      {index != 0 && (
                                        <Menu.Target>
                                          <Button
                                            leftSection={<IconArrowBackUp />}
                                            loading={isGoing}
                                          >
                                            Go to
                                          </Button>
                                        </Menu.Target>
                                      )}
                                      <Menu.Dropdown>
                                        {getPreviousSteps(
                                          currentStep?.instanceStep?.order,
                                        ).map((step, index) => {
                                          return (
                                            <Menu.Item
                                              key={index}
                                              onClick={async () => {
                                                handleGoTo(step.id, step.name);
                                              }}
                                            >
                                              <Group>
                                                <Avatar size={20}>
                                                  {step.order}
                                                </Avatar>
                                                {step.name}
                                              </Group>
                                            </Menu.Item>
                                          );
                                        })}
                                      </Menu.Dropdown>
                                    </Menu>
                                  </Group>
                                </>
                              )}
                          </Stack>
                        </>
                      }
                    />
                  );
                })}
            </Stepper>
          </Flex>
        </Section>
      </Box>
    </Flex>
  );
}

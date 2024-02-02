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
} from '@mantine/core';
import { Section } from '@megp/core-fe';
import classes from './accordion.module.css';
import { useEffect, useState } from 'react';
import { IconArrowBackUp } from '@tabler/icons-react';
import {
  useApproveMutation,
  useGetCurrentStepQuery,
  useGetStepsQuery,
  useGoToMutation,
  useInitiateWorkflowMutation,
} from '@/store/api/planning-approval/planning-approval';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@megp/auth';
import { useLazyGetGroupQuery } from '@/store/api/planning-approval/planning-iam';

const accordionData = [
  {
    label: 'Activites',
    content: 'Activites content',
  },
  {
    label: 'Items',
    content: 'Items content',
  },
  {
    label: 'Documents',
    content: 'Documents content',
  },
  {
    label: 'Timeline',
    content: 'Timeline content',
  },
];

export default function WorkflowHandling() {
  const { role, user } = useAuth();
  const [active, setActive] = useState(0);
  const activityId = '1f344819-d64d-4986-b192-ee06f5bf0e98';
  const [steps, setSteps] = useState<Record<string, any>[]>([]);
  const [currentStep, setCurrentStep] = useState<Record<string, any>>({});
  const [group, setGroup] = useState<any>();
  const [remark, setRemark] = useState('');
  const { data: stepsList } = useGetStepsQuery({
    activityId: activityId,
  });
  const [getGroup, { data: groupData }] = useLazyGetGroupQuery();
  const [approve, { isLoading: isApproving }] = useApproveMutation();
  const [goToStep, { isLoading: isGoing }] = useGoToMutation();
  const { data: currentStepData } = useGetCurrentStepQuery({
    activityId: activityId,
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
      setActive(currentStep?.step?.order);
    } else {
      setActive(currentStep?.step?.order - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    setCurrentStep(currentStepData);
  }, [currentStepData]);

  useEffect(() => {
    setSteps(stepsList?.items);
  }, [stepsList]);

  const handleApprove = async () => {
    try {
      await approve({
        workFlowType: 'test',
        metaData: {
          name: currentStep?.step.name.split(' ').join(''),
          action: 'Approved',
          remark: remark,
          approver: `${user?.firstName} ${user?.lastName}`,
          userId: user?.id,
        },
        activityId: activityId,
      }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Approved successfully.',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error approving.',
      });
    }
  };

  const handleAdjust = async () => {
    try {
      await approve({
        workFlowType: 'test',
        metaData: {
          name: currentStep?.step.name.split(' ').join(''),
          action: 'reject',
          remark: remark,
          approver: `${user?.firstName} ${user?.lastName}`,
          userId: user?.id,
        },
        activityId: activityId,
      }).unwrap();

      notifications.show({
        title: 'Success',
        message: 'Approved successfully.',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error adjusting.',
      });
    }
  };

  // const handleInitiate = async () => {
  //   try {
  //     await initiateWorkflow({
  //       name: activityName,
  //       activityId: activityId,
  //       id: itemId,
  //     }).unwrap();
  //     notifications.show({
  //       title: 'Success',
  //       message: 'Workflow started succcesfully.',
  //     });
  //   } catch (error) {
  //     notifications.show({
  //       title: 'Error',
  //       message: 'Error while initiating workflow.',
  //     });
  //   }
  // };

  const handleGoTo = async (stepId, stepName) => {
    try {
      await goToStep({
        workFlowType: 'test',
        details: {
          name: currentStep?.step.name.split(' ').join(''),
          action: 'reject',
          remark: remark,
          approver: `${user?.firstName} ${user?.lastName}`,
          userId: user?.id,
        },
        activityId: activityId,
        goto: { id: stepId, status: stepName },
      }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Approved successfully.',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error rejecting.',
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
      (entry) => entry.groupId === currentStep?.step.approvers[0].id,
    );
  }

  function getMetaData(currentStep, stepId, key) {
    return currentStep?.find((e) => e.stepId === stepId)[key];
  }

  function getPreviousSteps(stepId) {
    return steps.filter((step) => step.order < stepId);
  }

  return (
    <Flex gap="md">
      {/* <Box className="w-1/2">
        <Section title="Planning document" collapsible={false}>
          <Accordion classNames={classes} className="pb-6">
            {accordionData.map((item, index) => (
              <Accordion.Item key={index} value={item.label}>
                <Accordion.Control>{item.label}</Accordion.Control>
                <Accordion.Panel>{item.content}</Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
          <Button
            onClick={async () => {
              await handleInitiate();
            }}
            loading={isInitiating}
          >
            Initiate Workflow
          </Button>
        </Section>
      </Box> */}
      <Box className="w-full">
        <Section title="Approval Workflow" collapsible={false}>
          <Flex gap="md">
            <Stepper
              active={active}
              orientation="vertical"
              iconSize={30}
              className="w-full"
              allowNextStepsSelect={false}
              color="green"
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
                      className="w-[400px]"
                      description={
                        <>
                          <Stack className="">
                            {step?.order < currentStep?.step?.order ? (
                              <Accordion
                                styles={{
                                  control: {
                                    outline: '1px solid white',
                                    paddingLeft: '0px',
                                  },
                                }}
                              >
                                <Accordion.Item
                                  value={`Approval by ${step.approvers[0].approver}`}
                                >
                                  <Accordion.Control>
                                    <Text c="#868e96">{`Approval by ${step.approvers[0].approver}`}</Text>
                                  </Accordion.Control>
                                  {/* <Accordion.Panel>
                                  {
                                    currentStep?.metadata.find(
                                      (e) => e.stepId === step.id,
                                    ).remark
                                  }
                                </Accordion.Panel> */}
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
                            {currentStep?.stepId === step.id &&
                              currentStep.status != 'Approved' &&
                              !checkIdStepIdExist(
                                currentStep,
                                user?.organizations?.[0].userId,
                                step.id,
                              ) &&
                              (role ===
                                currentStep?.step.approvers[0].approver ||
                                user?.organizations?.[0].userId ===
                                  currentStep?.step.approvers[0].id ||
                                checkUserGroup()) && (
                                <>
                                  <Textarea
                                    minRows={6}
                                    label="Remark"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    className="w-[350px]"
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
                                      <Menu.Target>
                                        <Button
                                          leftSection={<IconArrowBackUp />}
                                          loading={isGoing}
                                        >
                                          Go to
                                        </Button>
                                      </Menu.Target>
                                      <Menu.Dropdown>
                                        {getPreviousSteps(
                                          currentStep?.step.order,
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
              {/* <Stepper.Step
                label="Approval 1"
                description={
                  (role === currentStep?.step.approvers[0] || true) && (
                    <>
                      <Stack className="w-[400px]">
                        <Text>Approval by Procurment Unit Head</Text>
                        <Textarea minRows={6} label="Remark" />
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
                          <Button leftSection={<IconArrowBackUp />}>
                            Go to
                          </Button>
                        </Group>
                      </Stack>
                    </>
                  )
                }
              />
              <Stepper.Step
                label="Approval 2"
                description="Approval by Head of Procuring Entity"
              />
              <Stepper.Step
                label="Approval 3"
                description="Approval by endorsing committee"
              />
              <Stepper.Step
                label="Approval 4"
                description="Approval by Alemu Kebede"
              /> */}
            </Stepper>
            {/* <Stack className="w-1/2">
              {(role === currentStep?.step.approvers[0] ||
                `${user?.firstName} ${user?.lastName}` ===
                  currentStep?.step.approvers[0]) && (
                <>
                  <Textarea minRows={6} label="Remark" />
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
                    <Button leftSection={<IconArrowBackUp />}>Go to</Button>
                  </Group>
                </>
              )}
            </Stack> */}
          </Flex>
        </Section>
      </Box>
    </Flex>
  );
}

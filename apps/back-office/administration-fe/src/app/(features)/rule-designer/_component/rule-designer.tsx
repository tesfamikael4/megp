'use client';
import {
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { Section } from '@megp/core-fe';
import {
  IconCirclePlus,
  IconGitBranch,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber6,
  IconX,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Timeline } from '@mantine/core';
import {
  useAddRulesMutation,
  useDeleteRuleMutation,
  useUpdateRulesMutation,
} from '@/store/api/rule/rule.api';
import { notifications } from '@mantine/notifications';
import { IconNumber5 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const conditionsLookup = [
  {
    label: 'Procurment Category',
    field: 'procurementCategory',
    type: 'string',
  },
  {
    label: 'Value Threshold',
    field: 'valueThreshold',
    type: 'integer',
  },
];

const operatorsLookup = [
  { label: 'Is Equal, =', value: '==' },
  {
    label: 'Is Greater Than, >',
    value: '>',
  },
  {
    label: 'Is Greater Than/Equal, >=',
    value: '>=',
  },
  {
    label: 'Is Less Than, <',
    value: '<',
  },
  {
    label: 'Is Less Than/Equal, <=',
    value: '<=',
  },
];

const actionsLookup = [
  { type: 'validate', label: 'Validate', singleton: true },
  { type: 'set', label: 'Set', singleton: false },
];

const enforcementMethodsLookup = [
  { label: 'Flag', value: 'FLAG' },
  { label: 'Mandatory', value: 'MANDATORY' },
  { label: 'Optional', value: 'OPTIONAL' },
];

export default function RuleDesigner({
  rule,
  mode,
}: {
  rule: any;
  mode: 'new' | 'detail';
}) {
  const [name, setName] = useState('');
  const [rules, setRules] = useState<any>([
    {
      key: 0,
      conditions: [
        {
          field: '',
          operator: '==',
          value: '',
          key: 0,
          joinType: '&&',
          type: 'string',
        },
      ],
    },
  ]);
  const [actions, setActions] = useState<Record<any, any>[]>([
    { name: '', value: '', key: 0 },
  ]);
  const [defaultActions, setDefaultActions] = useState<Record<any, any>[]>([
    { name: '', value: '', key: 0 },
  ]);
  const [possibleReasons, setPossibleReasons] = useState<Record<any, any>[]>([
    { reason: '', key: 0 },
  ]);
  const [enforcementMethod, setEnforcementMethod] = useState<string | null>('');

  const [active, setActive] = useState(0);
  const [addRules, { isLoading: isSavingRules }] = useAddRulesMutation();
  const [updateRules, { isLoading: isUpdatingRules }] =
    useUpdateRulesMutation();
  const [deleteRule, { isLoading: isDeletingRule }] = useDeleteRuleMutation();
  const router = useRouter();

  useEffect(() => {
    if (mode == 'detail') {
      const reformattedRules = rule?.rules?.map((ruleItem, index) => {
        const reformattedConditions = ruleItem.conditions?.[0]?.map(
          (condition, index) => ({
            ...condition,
            key: index,
          }),
        );
        return {
          ...ruleItem,
          key: index,
          designerId: rule?.id,
          conditions: reformattedConditions,
        };
      });
      const reformattedActions = rule?.actions?.map((action, index) => ({
        ...action,
        key: index,
      }));
      const reformattedDefault = rule?.defaultActions?.map(
        (defaultAction, index) => ({
          ...defaultAction,
          key: index,
        }),
      );
      const reformattedReasons = rule?.possibleReasons?.map(
        (reason, index) => ({
          ...reason,
          key: index,
          designerId: rule?.id,
        }),
      );
      setName(rule?.name);
      setEnforcementMethod(rule?.enforcementMethod);
      setRules(reformattedRules);
      setActions(reformattedActions);
      setDefaultActions(reformattedDefault);
      setPossibleReasons(reformattedReasons);
    }
  }, [mode]);

  function toCamelCase(inputString: string): string {
    const words = inputString.split(' ');
    const camelCaseWords = words.map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
    return camelCaseWords.join('');
  }

  const handleSave = async () => {
    const reformattedData = {
      name: name,
      enforcementMethod,
      key: toCamelCase(name),
      rules: rules.map((rule, index) => ({
        key: `rule${rule.key + 1}`,
        executionOrder: index + 1,
        designerId: rule?.designerId,
        enforcementMethod: rule.enforcementMethod,
        conditions: [rule?.conditions],
      })),
      actions: actions,
      defaultActions: defaultActions,
      possibleReasons: possibleReasons,
    };
    if (mode == 'detail') {
      reformattedData['id'] = rule?.id;
    }
    try {
      mode == 'new' && (await addRules(reformattedData).unwrap());
      mode == 'detail' && (await updateRules(reformattedData).unwrap());
      notifications.show({
        title: 'Success',
        message: 'Rule saved successfully',
      });
      mode == 'new' && router.push('/rule-designer');
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
      });
    }
  };

  const handleRemove = async ({
    index,
    ruleIndex,
    type,
  }: {
    index: number;
    ruleIndex?: number;
    type: 'condition' | 'rule' | 'action' | 'defaultAction' | 'reason';
  }) => {
    if (type == 'condition') {
      const modifiedRule = rules.map((rule) => {
        if (rule.key == ruleIndex) {
          return {
            ...rule,
            conditions: rule?.conditions?.filter(
              (condition) => condition.key != index,
            ),
          };
        }
        return rule;
      });
      setRules(modifiedRule);
    } else if (type === 'rule') {
      const modifiedRule = rules.filter((rule) => rule.key !== index);
      modifiedRule.forEach((rule, index) => {
        rule.key = index;
      });
      if (mode == 'detail') {
        try {
          const rule = rules.find((rule) => rule.key == index);
          await deleteRule({ id: rule?.id }).unwrap();
          notifications.show({
            title: 'Success',
            message: 'Rule deleted successfully',
            color: 'green',
          });
          setRules(modifiedRule);
        } catch (err) {
          notifications.show({
            title: 'Error',
            message: 'Something went wrong',
            color: 'red',
          });
        }
      } else setRules(modifiedRule);
    } else if (type == 'action') {
      const modifiedActions = actions.filter((action) => action.key != index);
      setActions(modifiedActions);
    } else if (type == 'defaultAction') {
      const filteredDefault = defaultActions.filter(
        (defaultAction) => defaultAction.key != index,
      );
      setDefaultActions(filteredDefault);
    } else if (type == 'reason') {
      const filteredReasons = possibleReasons.filter(
        (reason) => reason.key != index,
      );
      setPossibleReasons(filteredReasons);
    }
  };

  const handleConditionsChange = ({
    ruleIndex,
    conditionIndex,
    key,
    value,
    type,
  }: {
    ruleIndex: number;
    conditionIndex: number;
    key: string;
    value: string | null;
    type?: string;
  }) => {
    const newRules = rules.map((rule) => {
      if (ruleIndex == rule.key) {
        const updatedConditions = rule?.conditions?.map((condition) => {
          if (condition.key === conditionIndex) {
            const modifiedCondition = {
              ...condition,
              [key]: value,
              joinType: '&&',
            };
            type && (modifiedCondition['type'] = type);
            return modifiedCondition;
          }
          return condition;
        });
        return {
          ...rule,
          conditions: updatedConditions,
        };
      }
      return rule;
    });

    setRules(newRules);
  };

  const handleActionsChange = ({ actionIndex, key, value }) => {
    const newActions = actions.map((action) => {
      if (action.key === actionIndex) {
        const actionType = actionsLookup.find(
          (action) => action.type == value,
        )?.singleton;
        if (actionType) {
          return {
            key: action.key,
            [key]: value,
          };
        }
        return {
          ...action,
          [key]: value,
        };
      }
      return action;
    });
    setActions(newActions);
  };

  const handleDefaultActionsChange = ({ defaultActionIndex, key, value }) => {
    const newDefaultActions = defaultActions.map((action) => {
      if (action.key === defaultActionIndex) {
        return {
          ...action,
          [key]: value,
        };
      }
      return action;
    });
    setDefaultActions(newDefaultActions);
  };

  return (
    <div>
      {
        <Stack className="w-2/3 mx-auto my-10">
          <Timeline active={active} bulletSize={32} lineWidth={2}>
            <Timeline.Item
              bullet={<IconNumber1 size={14} />}
              lineVariant="dashed"
            >
              <TextInput
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onClick={() => setActive(0)}
              />
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconNumber2 size={18} />}
              lineVariant="dashed"
            >
              <Select
                label="Enforcement Method"
                data={enforcementMethodsLookup}
                value={enforcementMethod}
                onChange={(value) => {
                  setEnforcementMethod(value);
                }}
                onClick={() => setActive(1)}
              />
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconNumber3 size={18} />}
              title="Add a condition"
              lineVariant="dashed"
            >
              <Stack className="mt-8">
                <>
                  <Group className="ml-auto">
                    <Button
                      className="ml-auto"
                      leftSection={<IconCirclePlus />}
                      onClick={() => {
                        setRules([
                          ...rules,
                          {
                            key: rules.length,
                            designerId: rule?.id,
                            conditions: [
                              {
                                field: '',
                                operator: '==',
                                value: '',
                                key: 0,
                                joinType: '&&',
                                type: 'string',
                              },
                            ],
                          },
                        ]);
                      }}
                    >
                      Add OR Condition
                    </Button>
                  </Group>
                  <LoadingOverlay visible={isDeletingRule} />
                  {rules.map((rule, ruleIndex) => {
                    return (
                      <Stack key={ruleIndex}>
                        <div className="flex gap-0 flex-col">
                          <Paper
                            withBorder
                            className="border-b-0 rounded-b-none bg-neutral-100 px-4 py-2"
                          >
                            <Flex className="w-full items-center">
                              <Text>Rule {ruleIndex + 1}</Text>
                              <Group className="ml-auto">
                                <IconX
                                  className="ml-auto cursor-pointer"
                                  size={20}
                                  onClick={() =>
                                    handleRemove({
                                      index: ruleIndex,
                                      type: 'rule',
                                    })
                                  }
                                />
                              </Group>
                            </Flex>
                          </Paper>
                          <Paper withBorder className="p-4" key={ruleIndex}>
                            <Stack>
                              {rule?.conditions.map(
                                (condition, conditionIndex) => (
                                  <Stack key={conditionIndex}>
                                    <div className="flex gap-4 w-full items-center">
                                      <Select
                                        placeholder={`${
                                          rules.conditions?.length > 1
                                            ? 'And'
                                            : 'Select a condition'
                                        }`}
                                        data={conditionsLookup.map(
                                          (condition) => ({
                                            label: condition.label,
                                            value: condition.field,
                                          }),
                                        )}
                                        value={condition?.field}
                                        className="w-1/3"
                                        onChange={(value) => {
                                          const type = conditionsLookup?.find(
                                            (condition) =>
                                              condition.field == value,
                                          )?.type;
                                          handleConditionsChange({
                                            ruleIndex,
                                            conditionIndex,
                                            key: 'field',
                                            value,
                                            type,
                                          });
                                        }}
                                        onClick={() => setActive(2)}
                                      />
                                      <Select
                                        data={operatorsLookup}
                                        value={condition?.operator}
                                        onChange={(value) => {
                                          handleConditionsChange({
                                            ruleIndex,
                                            conditionIndex,
                                            key: 'operator',
                                            value,
                                          });
                                        }}
                                        defaultValue={'=='}
                                        className="w-1/3"
                                      />
                                      <TextInput
                                        onChange={(e) => {
                                          handleConditionsChange({
                                            ruleIndex,
                                            conditionIndex,
                                            key: 'value',
                                            value: e.target.value,
                                          });
                                        }}
                                        value={condition?.value}
                                        className="w-1/3"
                                        placeholder="Value"
                                      />
                                      <IconX
                                        size={20}
                                        onClick={() =>
                                          handleRemove({
                                            index: conditionIndex,
                                            ruleIndex,
                                            type: 'condition',
                                          })
                                        }
                                        className="cursor-pointer"
                                      />
                                    </div>
                                    {rule?.conditions?.length > 1 &&
                                      conditionIndex + 1 !=
                                        rule?.conditions.length && (
                                        <Divider
                                          my={'md'}
                                          label={<Badge>AND</Badge>}
                                          labelPosition="center"
                                        />
                                      )}
                                  </Stack>
                                ),
                              )}
                              <Button
                                leftSection={<IconCirclePlus />}
                                onClick={() => {
                                  const newRules = rules.map((rule) => {
                                    if (ruleIndex == rule.key) {
                                      return {
                                        ...rule,
                                        conditions: [
                                          ...rule.conditions,
                                          {
                                            key: rule.conditions.length,
                                            field: '',
                                            operator: '==',
                                            value: '',
                                            joinType: '&&',
                                            type: 'string',
                                          },
                                        ],
                                      };
                                    }
                                    return rule;
                                  });
                                  setRules(newRules);
                                }}
                                className="mr-auto"
                              >
                                Add AND condition
                              </Button>
                            </Stack>
                          </Paper>
                          {rules?.length > 1 &&
                            ruleIndex + 1 != rules.length && (
                              <Divider
                                my={'md'}
                                labelPosition="center"
                                label={<Badge color="gray">OR</Badge>}
                              />
                            )}
                        </div>
                      </Stack>
                    );
                  })}
                </>
              </Stack>
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconNumber4 size={18} />}
              title="Add an action"
              lineVariant="dashed"
            >
              <Stack className="mt-8">
                {actions.map((action, actionIndex) => (
                  <div
                    key={actionIndex}
                    className="flex gap-4 w-full items-center"
                  >
                    <Select
                      placeholder="Select an action"
                      data={actionsLookup.map((action) => ({
                        label: action.label,
                        value: action.type,
                      }))}
                      value={action?.type}
                      className="w-1/3"
                      onChange={(value) => {
                        handleActionsChange({
                          actionIndex,
                          key: 'type',
                          value,
                        });
                      }}
                      onClick={() => setActive(3)}
                    />

                    {'name' in action && (
                      <TextInput
                        value={action?.name}
                        onChange={(e) => {
                          handleActionsChange({
                            actionIndex,
                            key: 'name',
                            value: e.target.value,
                          });
                        }}
                        placeholder="Name"
                        className="w-1/3"
                      />
                    )}
                    {'value' in action && (
                      <TextInput
                        value={action?.value}
                        onChange={(e) => {
                          handleActionsChange({
                            actionIndex,
                            key: 'value',
                            value: e.target.value,
                          });
                        }}
                        placeholder="Value"
                        className="w-1/3"
                      />
                    )}
                    <IconX
                      size={20}
                      onClick={() =>
                        handleRemove({
                          index: actionIndex,
                          type: 'action',
                        })
                      }
                      className="cursor-pointer"
                    />
                  </div>
                ))}
                <Button
                  leftSection={<IconCirclePlus />}
                  onClick={() =>
                    setActions([
                      ...actions,
                      {
                        type: '',
                        name: '',
                        value: '',
                        key: actions.length,
                      },
                    ])
                  }
                  className="mr-auto"
                >
                  Add new action
                </Button>
              </Stack>
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconNumber5 size={18} />}
              title="Add default action"
              lineVariant="dashed"
            >
              <Stack className="mt-8">
                {defaultActions.map((action, defaultActionIndex) => (
                  <div
                    key={defaultActionIndex}
                    className="flex gap-4 w-full items-center"
                  >
                    <Select
                      placeholder="Select an action"
                      data={actionsLookup.map((action) => ({
                        label: action.label,
                        value: action.type,
                      }))}
                      value={action?.type}
                      className="w-1/3"
                      onChange={(value) => {
                        handleDefaultActionsChange({
                          defaultActionIndex,
                          key: 'type',
                          value,
                        });
                      }}
                      onClick={() => setActive(4)}
                    />
                    <TextInput
                      value={action?.name}
                      onChange={(e) => {
                        handleDefaultActionsChange({
                          defaultActionIndex,
                          key: 'name',
                          value: e.target.value,
                        });
                      }}
                      placeholder="Name"
                      className="w-1/3"
                    />

                    <TextInput
                      value={action?.value}
                      onChange={(e) => {
                        handleDefaultActionsChange({
                          defaultActionIndex,
                          key: 'value',
                          value: e.target.value,
                        });
                      }}
                      placeholder="Value"
                      className="w-1/3"
                    />
                    <IconX
                      size={20}
                      onClick={() =>
                        handleRemove({
                          index: defaultActionIndex,
                          type: 'defaultAction',
                        })
                      }
                      className="cursor-pointer"
                    />
                  </div>
                ))}
                <Button
                  leftSection={<IconCirclePlus />}
                  onClick={() =>
                    setDefaultActions([
                      ...defaultActions,
                      {
                        type: '',
                        name: '',
                        value: '',
                        key: defaultActions.length,
                      },
                    ])
                  }
                  className="mr-auto"
                >
                  Add Default action
                </Button>
              </Stack>
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconNumber6 size={18} />}
              title="Add Possible Reasons"
              lineVariant="dashed"
            >
              <Stack className="mt-8">
                {possibleReasons.map((reason, reasonIndex) => (
                  <div
                    key={reasonIndex}
                    className="flex gap-4 w-full items-center"
                  >
                    <Textarea
                      value={reason?.reason}
                      onClick={() => setActive(5)}
                      onChange={(e) => {
                        const updatedReasons = possibleReasons.map((reason) => {
                          if (reason.key == reasonIndex) {
                            return {
                              ...reason,
                              reason: e.target.value,
                            };
                          }
                          return reason;
                        });
                        setPossibleReasons(updatedReasons);
                      }}
                      className="w-full"
                      placeholder="Enter possible reason..."
                    />
                    <IconX
                      size={20}
                      onClick={() =>
                        handleRemove({
                          index: reasonIndex,
                          type: 'reason',
                        })
                      }
                      className="cursor-pointer"
                    />
                  </div>
                ))}
                <Button
                  leftSection={<IconCirclePlus />}
                  onClick={() =>
                    setPossibleReasons([
                      ...possibleReasons,
                      {
                        type: '',
                        name: '',
                        value: '',
                        key: possibleReasons.length,
                      },
                    ])
                  }
                  className="mr-auto"
                >
                  Add Possible Reasons
                </Button>
              </Stack>
            </Timeline.Item>
          </Timeline>
          <Button
            className="ml-auto"
            onClick={handleSave}
            loading={isSavingRules || isUpdatingRules}
          >
            Save
          </Button>
        </Stack>
      }
    </div>
  );
}

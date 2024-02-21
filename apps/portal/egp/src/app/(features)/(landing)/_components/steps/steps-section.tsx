'use client';
import {
  Container,
  Title,
  Text,
  Button,
  Flex,
  Input,
  Box,
  rem,
} from '@mantine/core';
import classes from './HeroImageRight.module.css';
import {
  IconCheck,
  IconNote,
  IconSearch,
  IconUserEdit,
} from '@tabler/icons-react';
import Step, { StepProps } from './Step';

const steps: StepProps[] = [
  {
    color: 'green',
    icon: <IconUserEdit size={40} color="white" />,
    title: 'Create Account',
    description:
      "Create an account to get started with your account. It's free and easy.",
    arrow: true,
  },
  {
    color: 'yellow',
    icon: <IconNote size={40} color="white" />,
    title: 'Vendor Registration',
    description:
      "Create an account to get started with your account. It's free and easy.",
    arrow: true,
  },
  {
    color: 'blue',
    icon: <IconCheck size={40} color="white" />,
    title: 'Get Approved',
    description:
      'Great! you are approved, Lorem ipsum dolor Lorem ipsum dolor Lorem ',
  },
];

export function StepsSection() {
  return (
    <Flex className={classes.root}>
      <Container size="xl" className="">
        <Flex
          direction={'column'}
          className="items-center justify-between  w-full py-4 gap-y-4"
        >
          <Text className={'text-white text-3xl'} fw={700} my={rem(20)}>
            Steps To Be A Supplier
          </Text>
          <Flex className="flex-col md:flex-row w-full">
            {steps.map((step, index) => (
              <Step key={index} {...step} />
            ))}
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}

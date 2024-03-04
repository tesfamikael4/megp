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
    icon: <IconUserEdit size={38} color="white" stroke={1.6} />,
    title: 'Create Account',
    description:
      "Create an account to get started with your account. It's free and easy.",
    arrow: true,
  },
  {
    color: 'yellow',
    icon: <IconNote size={38} color="white" stroke={1.6} />,
    title: 'Vendor Registration',
    description:
      "Create an account to get started with your account. It's free and easy.",
    arrow: true,
  },
  {
    color: 'blue',
    icon: <IconCheck size={38} color="white" stroke={1.6} />,
    title: 'Get Approved',
    description:
      'Great! you are approved, Lorem ipsum dolor Lorem ipsum dolor Lorem ',
  },
];

export function StepsSection() {
  return (
    <Flex className={classes.root}>
      <Container size="xl" className="">
        <Flex className="items-center justify-between flex-col w-full md:gap-8 p">
          <Text
            className={'text-lg md:mb-16  my-6'}
            fz={{
              xs: 24,
              sm: 26,
              md: 24,
              xl: 34,
            }}
            c="white"
            fw={700}
          >
            Steps To Be A Supplier
          </Text>
          <Flex className="flex-col md:flex-row w-full gap-4">
            {steps.map((step, index) => (
              <Step key={index} {...step} />
            ))}
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}

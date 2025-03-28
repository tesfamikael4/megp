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
    icon: (
      <span className="flex items-center justify-center p-1 rounded-full border-[3px] border-white border-solid">
        <IconCheck size={38} color="white" stroke={1.6} />
      </span>
    ),
    title: 'Get Approved',
    description: 'Great! you are approved.',
  },
];

export function StepsSection() {
  return (
    <Flex className={classes.root}>
      <div className={classes.shadow}></div>
      <Container size="xl" className={classes.content}>
        <Flex className="items-center justify-between flex-col w-full md:gap-8 p-6">
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
            Steps To Be A Vendor
          </Text>
          <Flex className="flex-col md:flex-row w-full gap-14">
            {steps.map((step, index) => (
              <>
                <Step key={index} {...step} />
              </>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}

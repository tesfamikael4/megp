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
      'Great! you are approved, Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dr',
  },
];

export function StepsSection() {
  return (
    <Flex className={classes.root}>
      <Container size="xl">
        <Flex
          direction={'column'}
          align="center"
          className="items-center justify-center lg:h-96"
        >
          {' '}
          {/* made some adjustment here*/}
          <Text className={classes.stepTitle} fw="bold" size="xl" mt={rem(20)}>
            Steps To Be A Supplier
          </Text>
          <Flex
            justify={'center'}
            className="flex-col md:flex-row"
            columnGap={rem(30)}
          >
            {steps.map((step, index) => (
              <Step key={index} {...step} />
            ))}
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}

import React, { ReactElement } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  rem,
  useMantineTheme,
  Image,
  Button,
  Container,
  ActionIcon,
} from '@mantine/core';
import { IconArrowDown, IconArrowRight } from '@tabler/icons-react';

export interface StepProps {
  color: string;
  icon: ReactElement;
  title: string;
  description: string;
  arrow?: boolean;
}

const Step = (props: StepProps) => {
  return (
    <>
      <Flex
        className="items-center justify-center flex-col md:flex-row md:gap-10"
        color="white"
      >
        <Flex className="flex-col items-center">
          <Avatar
            bg={props.color}
            variant="light"
            size="lg"
            w={62}
            h={62}
            mb={16}
            hiddenFrom="md"
          >
            {props.icon}
          </Avatar>
          <Avatar
            bg={props.color}
            variant="light"
            size="lg"
            w={82}
            h={82}
            mb={16}
            visibleFrom="md"
          >
            {props.icon}
          </Avatar>
          <Text
            fz={{
              sm: 16,
              md: 18,
              lg: 22,
              xl: 22,
            }}
            fw="bold"
            c="white"
            ta="center"
          >
            {props.title}
          </Text>
          <Text size="xs" c="white" ta="center" maw={350}>
            {props.description}
          </Text>
        </Flex>

        {props.arrow && (
          <React.Fragment>
            <ActionIcon
              variant="light"
              bg="transparent"
              c="white"
              visibleFrom="sm"
              size={60}
            >
              <IconArrowRight size={46} color="white" />
            </ActionIcon>
            <ActionIcon
              variant="light"
              bg="transparent"
              c="white"
              hiddenFrom="sm"
            >
              <IconArrowDown size={40} />
            </ActionIcon>
          </React.Fragment>
        )}
      </Flex>
    </>
  );
};

export default Step;

'use client';
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
import { IconArrowDown } from '@tabler/icons-react';

export interface StepProps {
  color: string;
  icon: ReactElement;
  title: string;
  description: string;
  arrow?: boolean;
}

const Step = (props: StepProps) => {
  const theme = useMantineTheme();
  theme.breakpoints.lg;

  return (
    <>
      <Flex
        columnGap={rem(10)}
        align="center"
        justify={'center'}
        className="flex-col md:flex-row"
        rowGap={rem(10)}
        color="white"
        p={rem(24)}
      >
        <Flex
          direction="column"
          className=" lg:pt-0 text-center"
          align="center"
        >
          <Avatar bg={props.color} variant="light" size="lg" w={82} h={82}>
            {props.icon}
          </Avatar>
          <Text size="lg" fw="bold" c="white">
            {props.title}
          </Text>
          <Text size="xs" c="white">
            {props.description}
          </Text>
        </Flex>

        {props.arrow && (
          <>
            <Image
              src="/rightarrow.svg"
              alt=""
              visibleFrom="sm"
              className="place-self-start md:mt-[40px]"
            />
            <ActionIcon
              variant="light"
              bg="transparent"
              c="white"
              hiddenFrom="sm"
            >
              <IconArrowDown size={40} />
            </ActionIcon>
          </>
        )}
      </Flex>
    </>
  );
};

export default Step;

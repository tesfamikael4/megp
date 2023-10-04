import { Box, Text } from '@mantine/core';
import React from 'react';
import styles from './landing.module.scss';
type CircleCardProps = {
  borderColor: string;
  iconColor: string;
  icon: any;
  title: string;
  subTitle: string;
};
export const CircleCard = (props: CircleCardProps) => {
  return (
    <Box
      className={`${styles.circleCard} ${props.borderColor} mb-6 md:mb-0  border-2`}
      w={250}
      h={250}
    >
      <Box
        className={`${styles.circleCard} border-8  ${props.borderColor}`}
        p={20}
        mt={7}
        w={230}
        h={230}
      >
        <props.icon size="70" className={`mx-auto mb-5 ${props.iconColor}`} />
        <Text fw="bold" className="text-center">
          {props.title}
        </Text>
        <Text size="xs" fw="500" className="text-center">
          {props.subTitle}
        </Text>
      </Box>
    </Box>
  );
};

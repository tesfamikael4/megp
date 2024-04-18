import { Box, Card, CardProps, rgba, Text } from '@mantine/core';
import React from 'react';

interface InfoCardProps extends Partial<CardProps> {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: any;
  className?: string;
  iconProps?: {
    size: number;
    stroke: number;
    color: string;
  };
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon: Icon,
  className,
  iconProps,
  ...props
}) => {
  return (
    <Card {...props} maw={318} radius="sm">
      {Icon && (
        <Box
          className="mb-3 w-8 h-8 flex items-center justify-center rounded-full"
          bg={rgba(iconProps?.color ?? '', 0.12)}
        >
          {<Icon {...iconProps} />}
        </Box>
      )}
      <Box>
        {title &&
          (typeof title === 'string' ? (
            <Text fz={14} fw={500} c="#53686A" mb={4}>
              {title}
            </Text>
          ) : (
            title
          ))}
        {description &&
          (typeof description === 'string' ? (
            <Text fz={12} c="#53686A" className=" text-justify ">
              {description}
            </Text>
          ) : (
            description
          ))}
      </Box>
    </Card>
  );
};

export default InfoCard;

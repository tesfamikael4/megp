import {
  Accordion,
  ActionIcon,
  Avatar,
  Flex,
  Group,
  Text,
} from '@mantine/core';

interface AccordionLabelProps {
  label: string;
  icon: any;
  description: string;
  activeValue: string | null;
}

function AccordionLabel({
  label,
  icon,
  description,
  activeValue,
}: AccordionLabelProps) {
  return (
    <Group wrap="nowrap">
      <Flex direction={'column'}>
        <Text>{label}</Text>
        {!activeValue ||
          (activeValue !== label && (
            <Text size="sm" c="dimmed" className="line-clamp-1" fw={400}>
              {description}
            </Text>
          ))}
      </Flex>
    </Group>
  );
}

export const AccordionCard = ({ icon, value, description, activeValue }) => {
  return (
    <Accordion.Item value={value}>
      <Accordion.Control
        className="pl-0"
        icon={icon}
        styles={{
          icon: {
            color: '#40C057',
          },
        }}
      >
        <AccordionLabel
          icon={icon}
          label={value}
          description={description}
          activeValue={activeValue}
        />
      </Accordion.Control>
      <Accordion.Panel c="dimmed" className="pl-5">
        {description}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

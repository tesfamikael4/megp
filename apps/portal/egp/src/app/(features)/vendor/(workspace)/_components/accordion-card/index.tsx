import { Accordion } from '@mantine/core';

export const AccordionCard = ({ icon, value, description }) => {
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
        {value}
      </Accordion.Control>
      <Accordion.Panel c="dimmed" className="pl-5">
        {description}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

'use client';
import React from 'react';
import { Accordion, rem, Text } from '@mantine/core';

interface AccordionData {
  title: string;
  description?: string;
}

interface AccordionProps {
  data: AccordionData[];
}

const DataAccordion: React.FC<AccordionProps> = ({ data }) => {
  return (
    <Accordion transitionDuration={500}>
      {data.map((item, index) => (
        <Accordion.Item
          key={index}
          value={item.title?.toLowerCase().replace(/\s+/g, '-')}
        >
          <Accordion.Control>
            <Text
              fz={{
                base: 14,
                sm: 18,
              }}
              fw={600}
            >
              {item.title}
            </Text>
          </Accordion.Control>
          <Accordion.Panel
            fz={{
              base: 12,
              sm: 16,
            }}
          >
            {item.description}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default DataAccordion;

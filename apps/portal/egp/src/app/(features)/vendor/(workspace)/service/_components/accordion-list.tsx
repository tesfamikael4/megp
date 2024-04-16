import { Accordion, Text } from '@mantine/core';
import React, { memo, useState } from 'react';
import { AccordionCard } from '../../_components/accordion-card';
import { IconFile, IconPlus } from '@tabler/icons-react';

const groceries = [
  {
    icon: <IconPlus size={24} stroke={1.6} />,
    value: 'New Application',
    description:
      'Use the feature to register a business entity for the first time. Please follow the instruction to properly register your business entity Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet interdum velit libero nec risus. Aliquam non libero dolor. Mauris ornare eu justo non euismod. Nam neque leo, mollis ac iaculis in, dapibus ut quam. Vivamus eleifend id nibh in luctus. Quisque eget tincidunt neque. Nunc finibus ex est, sed elementum metus condimentum in. Nullam vitae scelerisque mi. Cras dapibus elementum urna nec fermentum. Curabitur sit amet lacus tempus, pulvinar tortor quis, venenatis odio.',
  },
  {
    icon: <IconFile size={24} stroke={1.6} />,
    value: 'Benefits of Being a registered vendor',
    description:
      'Use the feature to register a business entity for the first time. Please follow the instruction to properly register your business entity Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet interdum velit libero nec risus. Aliquam non libero dolor. Mauris ornare eu justo non euismod. Nam neque leo, mollis ac iaculis in, dapibus ut quam. Vivamus eleifend id nibh in luctus. Quisque eget tincidunt neque. Nunc finibus ex est, sed elementum metus condimentum in. Nullam vitae scelerisque mi. Cras dapibus elementum urna nec fermentum. Curabitur sit amet lacus tempus, pulvinar tortor quis, venenatis odio.',
  },
];
const AccordionInformation: React.FC = memo(() => {
  const [value, setValue] = useState<string | null>('New Application');
  return (
    <React.Fragment>
      <Accordion
        defaultValue="New Application"
        value={value}
        onChange={setValue}
      >
        {groceries.map((item, index) => (
          <AccordionCard
            key={index}
            icon={item.icon}
            value={item.value}
            description={item.description}
            activeValue={value}
          />
        ))}
      </Accordion>
    </React.Fragment>
  );
});
AccordionInformation.displayName = 'AccordionInformation';
export default AccordionInformation;

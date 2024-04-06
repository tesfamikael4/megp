'use client';
import {
  Accordion,
  Avatar,
  Card,
  Divider,
  Flex,
  Group,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBuildingBank,
  IconChecklist,
  IconFileCheck,
  IconFileDescription,
  IconPlus,
} from '@tabler/icons-react';
import { AccordionCard } from '../../_components/accordion-card';
import { useState } from 'react';

export const groceries = [
  {
    icon: <IconPlus size={24} stroke={1.6} />,
    value: 'New Application',
    description:
      'Use the feature to register a business entity for the first time. Please follow the instruction to properly register your business entity Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet interdum velit libero nec risus. Aliquam non libero dolor. Mauris ornare eu justo non euismod. Nam neque leo, mollis ac iaculis in, dapibus ut quam. Vivamus eleifend id nibh in luctus. Quisque eget tincidunt neque. Nunc finibus ex est, sed elementum metus condimentum in. Nullam vitae scelerisque mi. Cras dapibus elementum urna nec fermentum. Curabitur sit amet lacus tempus, pulvinar tortor quis, venenatis odio.',
  },
  {
    icon: <IconFileDescription size={24} stroke={1.6} />,
    value: 'Draft Application',
    description:
      'Accessing business entity registration applications pending final submission. You have the option to save your application as a draft or complete it with Lorem Ipsum. Ensure all necessary details are accurately provided before finalizing the submission. Review the application thoroughly for any errors or missing information. Utilize the Lorem Ipsum placeholder text for incomplete sections if needed. Once satisfied, proceed with the final submission process. Double-check all entered data to ensure compliance with registration requirements.',
  },
  {
    icon: <IconFileCheck size={24} stroke={1.6} />,
    value: 'Follow-up Tasks',
    description:
      'If the registering agency (FPPA) requires additional information to finalize your application, casework may communicate by utilizing Lorem Ipsum to create clear and concise requests. Ensure prompt response to any inquiries to expedite the application process. Stay attentive to communication from the agency to address any outstanding requirements promptly. Utilize Lorem Ipsum placeholders if necessary to facilitate clear communication during the application review process. Keep channels open for efficient exchange of information to facilitate timely completion of the registration process.',
  },
  {
    icon: <IconChecklist size={24} stroke={1.6} />,
    value: 'Application Tracking',
    description:
      'You can track the status of your application before receiving formal approval as a registered supplier. If additional information is required, Lorem Ipsum placeholders will be used in communication. Stay informed and responsive to any requests for clarification or additional details. Ensure timely submission of any requested information to expedite the approval process. Keep an eye on updates and notifications regarding your application status. Utilize Lorem Ipsum placeholders if necessary to facilitate clear communication during the process.',
  },
  {
    icon: <IconBuildingBank size={24} stroke={1.6} />,
    value: 'My Companies',
    description:
      'You have the capability to manage multiple business entities under your account. Access the Lorem Ipsum feature to retrieve profiles of these entities efficiently. Utilize this feature to view and manage the details and statuses of all associated entities conveniently. Stay organized by accessing comprehensive profiles for each business entity within your account. Ensure seamless management and oversight of all entities through this user-friendly feature. Utilize the Lorem Ipsum tool to access and review entity profiles with ease.',
  },
];

function Dashboard() {
  const [value, setValue] = useState<string | null>('New Application');
  return (
    <Card mx={24} className="p-5 mx-auto mt-6 mb-6 bg-white border">
      <Flex className="pl-6" direction={'column'}>
        <Text className=" text-emerald-600 font-bold" size="xl">
          Registration Services
        </Text>
        <Text size="sm" c="dimmed">
          In order to participate in government procurement, business entities
          need to register in the national supplier database. The registration
          service has the following functionalities:
        </Text>
      </Flex>
      <Divider my="md" className="w-full" size={'xs'} />
      <Accordion
        className="pl-6"
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
    </Card>
  );
}

export default Dashboard;

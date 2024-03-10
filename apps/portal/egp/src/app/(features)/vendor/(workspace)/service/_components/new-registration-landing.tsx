import {
  Accordion,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';
import { groceries } from '../../dashboard/_components/dashboard';
import { AccordionCard } from '../../_components/accordion-card';
import { IconFile, IconNote, IconPlus } from '@tabler/icons-react';

const NewRegistrationLanding = () => {
  const router = useRouter();
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
  return (
    <Box mx={24} className="p-5 mx-auto mt-6 mb-6 bg-white border h-[90%]">
      <Flex className="pl-6" direction={'column'} mb={22}>
        <Text className=" text-emerald-600 font-bold py-1.5 px-2" size="xl">
          Vendor Registration
        </Text>
        <Text size="sm" c="dimmed" className="px-2">
          In order to participate in government procurement, business entities
          need to register in the national supplier database. The registration
          service has the following functionalities::In order to participate in
          government procurement, business entities need to register in the
          national supplier database. The registration service has the following
          functionalities::
        </Text>
      </Flex>
      <Divider my="md" className="w-full" size={'xs'} />
      <Accordion className="pl-6" defaultValue="New Application">
        {groceries.map((item, index) => (
          <AccordionCard
            key={index}
            icon={item.icon}
            value={item.value}
            description={item.description}
          />
        ))}
      </Accordion>
      <Box className="flex items-center justify-end w-full mt-4 gap-x-3 shrink-0 sm:w-auto">
        <Button
          className="w-1/2 px-5 text-sm tracking-wide text-white transition-colors duration-200 shrink-0 sm:w-auto "
          onClick={() => router.push('/vendor/registration/new/basic')}
        >
          Register Now
        </Button>
      </Box>
    </Box>
  );
};

export default NewRegistrationLanding;

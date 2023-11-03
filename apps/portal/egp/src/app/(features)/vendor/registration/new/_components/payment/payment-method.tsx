import React from 'react';
import {
  Flex,
  Card,
  Paper,
  Group,
  Badge,
  Title,
  Text,
  SegmentedControl,
  Button,
  Center,
} from '@mantine/core';
import {
  IconBrandMastercard,
  IconBrandVisa,
  IconBuildingBank,
} from '@tabler/icons-react';

interface PaymentMethodProps {}

const PaymentMethod: React.FC<PaymentMethodProps> = () => {
  return (
    <Flex className="flex-col gap-8">
      <Title order={5} ta="center" mt="sm">
        Choose payment method
      </Title>
      {/* {form.errors['Method'] && (
          <Badge color="red" size="md" variant="outline">
            {form.errors['Method']}
          </Badge>
        )} */}

      <SegmentedControl
        styles={{
          root: {
            //   border: form.errors['Method'] ? '1px solid #f60000' : 'none',
          },
        }}
        radius="lg"
        data={[
          {
            value: 'bankDeposit',
            label: (
              <Flex className="items-center flex-col gap-4 p-2 min-w-[60px]">
                <Center className="rounded-full">
                  <IconBuildingBank size={30} stroke={1.3} />
                </Center>
                <Text size={'xs'} fw={700}>
                  Bank Deposit
                </Text>
              </Flex>
            ),
          },
          {
            value: 'Master Card',
            label: (
              <Flex className="items-center flex-col gap-4 p-2 min-w-[80px]">
                <Center className="rounded-full">
                  <IconBrandMastercard size={30} stroke={1.3} />
                </Center>
                <Text size={'xs'} fw={700}>
                  Master card
                </Text>
              </Flex>
            ),
          },
          {
            value: 'Visa',
            label: (
              <Flex className="items-center flex-col gap-4 p-2 min-w-[80px]">
                <Center className="rounded-full">
                  <IconBrandVisa size={30} stroke={1.3} />
                </Center>
                <Text size={'xs'} fw={700}>
                  Visa
                </Text>
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  );
};

export default PaymentMethod;

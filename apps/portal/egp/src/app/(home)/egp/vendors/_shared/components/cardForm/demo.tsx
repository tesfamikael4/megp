import React from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Box,
  Text,
  Code,
  Flex,
  Card,
  Select,
  Stack,
} from '@mantine/core';
import MultiCheckBox from '../multiCheckBox';

function DemoCardForm() {
  const form = useForm({
    initialValues: {
      areasOfBusinessInterest: {
        areasOfBusinessInterestNames: [],
        areasOfBusinessInterestInformation: [],
      },
    },
  });

  React.useEffect(() => {
    handleValueChange(form.values);
    return () => {};
  }, [form.values]);

  const handleValueChange = (values: typeof form.values) => {
    if (
      values.areasOfBusinessInterest.areasOfBusinessInterestNames.length > 0
    ) {
      const transformSelectedValues2 =
        values.areasOfBusinessInterest.areasOfBusinessInterestNames.map(
          (val) => ({
            category: val,
            lineOfBusiness: '',
            priceRange: '',
          }),
        );

      const ar1 = transformSelectedValues2.filter(
        (obj1) =>
          !values.areasOfBusinessInterest.areasOfBusinessInterestInformation.some(
            (obj2: any) => obj1.category === obj2.category,
          ),
      );

      const ar2: any =
        values.areasOfBusinessInterest.areasOfBusinessInterestInformation.filter(
          (obj2: any) =>
            !transformSelectedValues2.some(
              (obj1) => obj2.category === obj1.category,
            ),
        );

      if (ar1.length > 0) {
        form.insertListItem(
          'areasOfBusinessInterest.areasOfBusinessInterestInformation',
          ar1[0],
        );
      }

      if (ar2.length > 0) {
        const index =
          values.areasOfBusinessInterest.areasOfBusinessInterestInformation.findIndex(
            (item: any) => item.category === ar2[0].category,
          );
        if (index !== -1) {
          form.removeListItem(
            'areasOfBusinessInterest.areasOfBusinessInterestInformation',
            index,
          );
        }
      }
    } else {
      if (
        values.areasOfBusinessInterest.areasOfBusinessInterestInformation
          .length > 0
      )
        form.removeListItem(
          'areasOfBusinessInterest.areasOfBusinessInterestInformation',
          0,
        );
    }
  };

  const selectedCards =
    form.values.areasOfBusinessInterest.areasOfBusinessInterestInformation.map(
      (value: any, index) => (
        <Stack key={index} my={15}>
          <Card key={index} shadow="sm" radius="md">
            <Card.Section inheritPadding py="xs">
              <Text
                tt="uppercase"
                size="lg"
                className="font-[500]"
                mb="sm"
                p={4}
              >
                {value.category}
              </Text>
            </Card.Section>
            <Card.Section p={'md'}>
              <Flex direction={'column'} gap={10}>
                <TextInput
                  label="Line Of Business"
                  {...form.getInputProps(
                    `areasOfBusinessInterest.areasOfBusinessInterestInformation.${index}.lineOfBusiness`,
                  )}
                />
                <Select
                  label={'Price Range'}
                  placeholder="Input 2"
                  data={['100 - 1000', '1000 - 10000']}
                  {...form.getInputProps(
                    `areasOfBusinessInterest.areasOfBusinessInterestInformation.${index}.valueRange`,
                  )}
                />
              </Flex>
            </Card.Section>
          </Card>
        </Stack>
      ),
    );

  return (
    <Box>
      <MultiCheckBox
        label="Category"
        id="category"
        data={[
          {
            value: 'goods',
            label: 'Goods',
          },
          {
            value: 'services',
            label: 'Services',
          },
          {
            value: 'works',
            label: 'Works',
          },
        ]}
        {...form.getInputProps(
          `areasOfBusinessInterest.areasOfBusinessInterestNames`,
        )}
      />

      <Box mt="lg">
        {selectedCards.length > 0 ? selectedCards : 'No cards selected'}
      </Box>
    </Box>
  );
}

export default DemoCardForm;

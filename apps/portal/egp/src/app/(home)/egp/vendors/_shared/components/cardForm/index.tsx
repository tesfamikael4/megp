import React from 'react';
import { Box, Text, Flex, Select, Stack, MultiSelect } from '@mantine/core';
import MultiCheckBox from '../multiCheckBox';
import {
  transformCategoryListData,
  transformCategoryPriceRange,
} from '../../lib/objectParser/object';
import {
  useGetAreasOfBusinessInterestCategoriesListQuery,
  useGetAreasOfBusinessInterestPriceRangeQuery,
} from '@/store/api/vendor_registration/query';
interface Props {
  form: any;
}
const CardForm: React.FC<Props> = ({ form }) => {
  const {
    data: categoriesListData,
    isLoading: categoriesListIsLoading,
    status: categoriesListStatus,
  } = useGetAreasOfBusinessInterestCategoriesListQuery({});
  const {
    data: priceRangeData,
    isLoading: priceRangeIsLoading,
    status: priceRangeStatus,
  } = useGetAreasOfBusinessInterestPriceRangeQuery({});

  React.useEffect(() => {
    handleValueChange(form.values);
    return () => {};
  }, [form.values]);

  const handleValueChange = (values: typeof form.values) => {
    if (
      values.areasOfBusinessInterest &&
      values.areasOfBusinessInterest.areasOfBusinessInterestNames.length > 0
    ) {
      const transformSelectedValues2 =
        values.areasOfBusinessInterest.areasOfBusinessInterestNames.map(
          (val) => ({
            category: val,
            lineOfBusiness: [],
            priceRange: '',
          }),
        );

      const ar1 = transformSelectedValues2.filter(
        (obj1) =>
          !values.areasOfBusinessInterest.areasOfBusinessInterestInformation.some(
            (obj2) => obj1.category === obj2.category,
          ),
      );

      const ar2 =
        values.areasOfBusinessInterest.areasOfBusinessInterestInformation.filter(
          (obj2) =>
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
            (item) => item.category === ar2[0].category,
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
        values.areasOfBusinessInterest &&
        values.areasOfBusinessInterest.areasOfBusinessInterestInformation
          .length > 0
      )
        form.removeListItem(
          'areasOfBusinessInterest.areasOfBusinessInterestInformation',
          0,
        );
    }
  };

  const selectedCards = form.values.areasOfBusinessInterest
    ? form.values.areasOfBusinessInterest.areasOfBusinessInterestInformation.map(
        (value: any, index) => (
          <Stack key={index} my={15}>
            <Flex className="shadow-md p-4 rounded-md flex-col border">
              <Flex className="p-1 border-b">
                <Text tt="uppercase" p={4} className="font-[500]">
                  {value.category}
                </Text>
              </Flex>
              <Flex className="flex-col gap-4">
                <MultiSelect
                  label="Line Of Business"
                  {...form.getInputProps(
                    `areasOfBusinessInterest.areasOfBusinessInterestInformation.${index}.lineOfBusiness`,
                  )}
                  data={transformCategoryListData(
                    categoriesListStatus === 'fulfilled' &&
                      categoriesListData &&
                      categoriesListData.items.length
                      ? categoriesListData.items
                      : [],
                    value.category,
                  )}
                />
                <Select
                  label={'Price Range'}
                  placeholder="Input 2"
                  data={transformCategoryPriceRange(
                    priceRangeStatus === 'fulfilled' &&
                      priceRangeData &&
                      priceRangeData.items.length
                      ? priceRangeData.items
                      : [],
                    value.category,
                  )}
                  {...form.getInputProps(
                    `areasOfBusinessInterest.areasOfBusinessInterestInformation.${index}.priceRange`,
                  )}
                />
              </Flex>
            </Flex>
          </Stack>
        ),
      )
    : [];

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

      <Box mt="lg">{selectedCards.length > 0 ? selectedCards : ''}</Box>
    </Box>
  );
};

export default CardForm;

import { VendorLevel } from '@/models/vendorRegistration';

const getDataByBusinessArea = (
  businessArea: string,
  data: any[],
  field: string,
): { value: string; label: string }[] => {
  return (
    (data || [])
      .filter((item) => item.businessArea === businessArea)
      .map((item) => ({
        value: item.id,
        label: item[field],
      })) || []
  );
};
const getSegmentsFromAdministration = (
  data: any[],
  field: string,
): { value: string; label: string }[] => {
  return (
    (data || []).map((item) => ({
      value: item.id,
      label: item[field],
    })) || []
  );
};

export const getLineOfBusinessMultiSelectData = (
  businessArea: string,
  data: any[],
  field: string = 'description',
): { value: string; label: string }[] => {
  return getDataByBusinessArea(businessArea, data, field);
};

export const getLineOfBusinesseSelectOptions = (data: any[]) => {
  return getSegmentsFromAdministration(data, 'title');
};

export const getFormattedPriceRangeValues = (
  businessArea: string,
  data: any[],
): { value: string; label: string }[] => {
  return getDataByBusinessArea(businessArea, data, 'businessClass');
};

export const getCategoryProps = (
  fields,
  remove,
  append,
  fieldState,
  lockElements: (
    level: VendorLevel,
    status?: string | undefined,
  ) => {
    disabled: boolean;
  },
) => {
  return {
    value: fields.map((item) => item.category),
    onChange: (categories: string[]) => {
      // console.log(fields.)
      const fieldsCategories = fields.map((item) => item.category);
      const difference = fieldsCategories.filter(
        (category) => !categories.includes(category),
      );
      difference.map((category) => {
        const notExistingIndex = fields.findIndex(
          (field) => field.category === category,
        );
        remove(notExistingIndex);
      });
      categories.map((category) => {
        const existingIndex = fields.findIndex(
          (field) => field.category === category,
        );
        if (existingIndex === -1) {
          append({
            category,
            lineOfBusiness: [], // Start with an empty array
            priceRange: '',
          });
        }
      });
    },
    error: fieldState?.error?.message,

    // onFocus: () => clearValidationError(fieldName),
    // onBlur: () => validateField(fieldName),
    ...lockElements('ppda'),
  };
};

export const getAddServiceCategoryProps = (
  fields,
  remove,
  append,
  fieldState,
) => {
  return {
    value: fields.map((item) => item.category),
    onChange: (categories: string[]) => {
      // console.log(fields.)
      const fieldsCategories = fields.map((item) => item.category);
      const difference = fieldsCategories.filter(
        (category) => !categories.includes(category),
      );
      difference.map((category) => {
        const notExistingIndex = fields.findIndex(
          (field) => field.category === category,
        );
        remove(notExistingIndex);
      });
      categories.map((category) => {
        const existingIndex = fields.findIndex(
          (field) => field.category === category,
        );
        if (existingIndex === -1) {
          append({
            category,
            lineOfBusiness: [], // Start with an empty array
            priceRange: '',
          });
        }
      });
    },
    error: fieldState?.error?.message,
  };
};

export * from './initialValues';

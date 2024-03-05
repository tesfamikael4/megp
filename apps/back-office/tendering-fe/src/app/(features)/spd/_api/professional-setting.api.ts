import { SpdProfessionalSetting } from '@/models/spd/professional-setting.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base professionalSetting api
const professionalSettingApi =
  entityApi.entitySliceApi['spd-professional-settings'];

export const professionalSettingSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdProfessionalSetting>(
    professionalSettingApi,
    'spd-professional-settings',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = professionalSettingSliceApi;

import { regions } from '../variables/regions';

export const getRegionLabel: (key: string) => any = (key: string) => {
  for (let i = 0; i < regions.length; i++) {
    if (regions[i]?.value === key) {
      return regions[i]?.label;
    }
  }
  return null;
};

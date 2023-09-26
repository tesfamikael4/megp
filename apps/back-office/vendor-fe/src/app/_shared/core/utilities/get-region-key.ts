import { regions } from '../variables/regions';

export const getRegionKey: (label: any) => string | null = (label: any) => {
  for (let i = 0; i < regions.length; i++) {
    if (regions[i]?.label?.en === label?.en) {
      return regions[i]?.value;
    }
  }
  return null;
};

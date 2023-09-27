import { MultiLanguage } from '@jiret/translations';
import { regions } from '../variables/regions';

export const getRegionKey: (label: MultiLanguage) => string | null = (
  label: MultiLanguage,
) => {
  for (let i = 0; i < regions.length; i++) {
    if (regions[i]?.label?.en === label?.en) {
      return regions[i]?.value;
    }
  }
  return null;
};

import { NavItemWrapper } from '../../types/nav-item';

export const useDisplayNameFinder = (navLinks: NavItemWrapper[]) => {
  const path = usePathname();
  for (const navItem of navLinks) {
    if (navItem.children) {
      for (const childItem of navItem.children) {
        if (childItem.link === path.split('/')[3]) {
          return childItem.displayName;
        }
        if (childItem.links) {
          for (const subItem of childItem.links) {
            if (subItem.link === path.split('/')[3]) {
              return subItem.displayName;
            }
          }
        }
      }
    }
  }
  return ''; // Return null if the link is not found.
};

export const createQueryString = (obj) => {
  const queryString = Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
  return queryString;
};

import { usePathname, useSearchParams } from 'next/navigation';
export function SearchParamsToObject(key = '') {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  // Use Array.from to convert the entries to an array of key-value pairs
  const paramEntries = Array.from(params.entries());

  // Use Array.prototype.reduce to construct the paramsObject
  const paramsObject = paramEntries.reduce((acc, [paramKey, value]) => {
    acc[paramKey] = value;
    return acc;
  }, {});

  return key ? paramsObject[key] || '' : paramsObject;
}

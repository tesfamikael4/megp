import { NavItemWrapper } from '../../types/nav-item';

export const useDisplayNameFinder = (navLinks: NavItemWrapper[]) => {
  const path = window.location.pathname;

  for (const navItem of navLinks) {
    if (navItem.children) {
      for (const childItem of navItem.children) {
        if (childItem.link === path.split('/')[2]) {
          return childItem.displayName;
        }
        if (childItem.links) {
          for (const subItem of childItem.links) {
            if (subItem.link === path.split('/')[2]) {
              return subItem.displayName;
            }
          }
        }
      }
    }
  }
  return ''; // Return null if the link is not found.
};

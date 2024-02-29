import { Box, NavLink, Text, UnstyledButton } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import styles from './sidebar.module.scss';
import { menus } from './_constants';
import { MenuLinks } from './models';

function createNavLinks(
  links: MenuLinks.SidebarLinks[] | undefined,
  currentPath: string,
  router: any,
) {
  return links?.map((link) => (
    <UnstyledButton
      key={link.label}
      className={`${styles.mainLink} ${currentPath === link.link && styles.activeLink}`}
      onClick={() => link.link && router.push(link.link)}
    >
      <NavLink
        label={link.label}
        leftSection={link.icon && <link.icon size="1.2rem" stroke={1.5} />}
        key={link.label}
        className={!link.icon ? styles.sidebarChildren : ''}
      >
        {createNavLinks(link.links, currentPath, router)}
      </NavLink>
    </UnstyledButton>
  ));
}
function Sidebar() {
  const router = useRouter();
  const path = usePathname();

  return (
    <Box className={styles.sidebarMain}>
      <Box className={styles.mainLinks}>
        <Text className={styles.groupTitle}>Solicitation</Text>
        {createNavLinks(menus.solicitationLinks, path, router)}
      </Box>
    </Box>
  );
}

export default Sidebar;

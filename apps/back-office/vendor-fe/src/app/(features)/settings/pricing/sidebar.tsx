import React from 'react';
import { NavLink } from '@mantine/core';
import { IconGauge, IconFingerprint } from '@tabler/icons-react';
import { SideBar } from '@megp/core-fe';
export function Menu() {
  return (
    <SideBar>
      <NavLink
        label="First parent link"
        leftSection={<IconGauge size="1rem" stroke={1.5} />}
        childrenOffset={28}
      >
        <NavLink label="First child link" />
        <NavLink label="Second child link" />
        <NavLink label="Nested parent link" childrenOffset={28}>
          <NavLink label="First child link" />
          <NavLink label="Second child link" />
          <NavLink label="Third child link" />
        </NavLink>
      </NavLink>

      <NavLink
        label="Second parent link"
        leftSection={<IconFingerprint size="1rem" stroke={1.5} />}
        childrenOffset={28}
        defaultOpened
      >
        <NavLink label="First child link" />
        <NavLink label="Second child link" />
        <NavLink label="Third child link" />
      </NavLink>
    </SideBar>
  );
}

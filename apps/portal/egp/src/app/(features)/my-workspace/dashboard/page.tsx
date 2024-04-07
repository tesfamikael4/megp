import React from 'react';
import Dashboard from './_components/dashboard';
import { IconBriefcase, IconFileCheck, IconFolder } from '@tabler/icons-react';
import { Avatar } from '@mantine/core';
import DashboardCard from '../_components/card';

const infoCard = [
  {
    icon: (
      <Avatar color="#81D49A" variant="filled" radius={10}>
        <IconFolder size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'Draft Applications',
    count: 0,
    percent: 0,
  },
  {
    icon: (
      <Avatar
        styles={{
          placeholder: {
            background: '#F6C488',
          },
        }}
        variant="filled"
        radius={10}
      >
        <IconBriefcase size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'Registered Companies',
    count: 0,
    percent: 0,
  },
  {
    icon: (
      <Avatar
        styles={{
          placeholder: {
            background: '#9CBEFF',
          },
        }}
        variant="filled"
        radius={10}
      >
        <IconFileCheck size={32} stroke={1.5} className="text-white" />
      </Avatar>
    ),
    title: 'Follow up Task',
    count: 0,
    percent: 0,
  },
];
function Page() {
  return (
    <>
      <DashboardCard infoCard={infoCard} />

      <Dashboard />
    </>
  );
}

export default Page;

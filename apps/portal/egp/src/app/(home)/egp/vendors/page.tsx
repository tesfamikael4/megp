'use client';

import { Navbar } from './_shared/components/navbar/Navbar';
import { navLinks } from './_shared/config';
import { AppShell, Box } from '@mantine/core';
import style from './layout.module.scss';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function VendorPage({ children }: Props) {
  redirect('vendors/dashboard');
  return <section>{children}</section>;
}

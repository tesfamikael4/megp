'use client';
import { getCookie, getCookies } from 'cookies-next';
import ApplicationList from '../_components/application-list';
import { useEffect, useState } from 'react';

export default function RenewalPage() {
  return <ApplicationList serviceKey="update" title="Profile Update" />;
}

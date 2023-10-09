'use client';
import { hasCookie } from 'cookies-next';

export const doesTokenExist = () => {
  const accessToken = hasCookie('st-access-token');
  const frontToken = hasCookie('sFrontToken');
  return accessToken || frontToken;
};

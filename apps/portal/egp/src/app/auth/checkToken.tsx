'use client';
import { hasCookie } from 'cookies-next';

export const doesTokenExist = () => {
  // 1. check if valid session, if not return null
  const accessToken = hasCookie('st-access-token');
  const frontToken = hasCookie('sFrontToken');
  return accessToken || frontToken;
};

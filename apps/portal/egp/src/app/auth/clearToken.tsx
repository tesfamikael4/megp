import { deleteCookie } from 'cookies-next';

export const clearToken = () => {
  deleteCookie('st-access-token');
  deleteCookie('sFrontToken');
  deleteCookie('st-last-access-token-update');
};

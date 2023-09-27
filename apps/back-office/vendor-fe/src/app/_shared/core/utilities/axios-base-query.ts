import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getCurrentSession } from './get-current-session';

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      headers?: AxiosRequestConfig['headers'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    const session = getCurrentSession();
    try {
      const config: AxiosRequestConfig = {
        url: baseUrl + url,
        method: method,
        data: data,
        params: params,
      };

      /**
       *  modified the regex so that it add x-header requests
       * to baseurls with hyphen in between like servce-store and without hyphens*/
      const regex = new RegExp(`\\/\\w+\\-\\w+\\/`);
      const regex2 = new RegExp(`\\/\\w+\\/`);
      const applicationMatch = window.location.href.match(regex)
        ? window.location.href.match(regex)
        : window.location.href.match(regex2);
      /*  */
      if (session?.accessToken) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${session.accessToken}`;
      }
      if (
        session?.profile &&
        session?.selectedOrganization &&
        session?.selectedUnit &&
        applicationMatch
      ) {
        axios.defaults.headers.common['x_personnel_id'] =
          session?.organizations?.find(
            (organization: any) =>
              session.selectedOrganization?.id === organization?.id,
          )?.personnelId;
        axios.defaults.headers.common['x_placement_id'] =
          session.selectedUnit?.placementId;

        /* Get applicationKey from url */
        const applicationKey = applicationMatch[0]?.substring(
          applicationMatch[0]?.indexOf('/') + 1,
          applicationMatch[0]?.length - 1,
        );
        axios.defaults.headers.common['x_application_key'] = applicationKey;
      }

      const result = await axios(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };

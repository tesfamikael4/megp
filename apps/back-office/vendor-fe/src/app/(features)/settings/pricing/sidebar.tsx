import React from 'react';
import { NavLink, Center, Loader } from '@mantine/core';
import { SideBar } from '@megp/core-fe';
import { useGetServicesQuery } from '@/store/api/service/service.api';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Service } from '@/models/service';
export function Menu() {
  const { data, isSuccess, isLoading } = useGetServicesQuery({} as any);
  const { service, area } = useParams();
  const router = useRouter();
  return (
    <SideBar>
      {isLoading && (
        <Center mt={30}>
          <Loader />
        </Center>
      )}
      {isSuccess &&
        data?.items?.map((item: Service) => {
          return (
            <NavLink
              label={item.name}
              key={item.id}
              active={service == item.key}
            >
              <NavLink
                label="Goods"
                onClick={() => {
                  router.push(`/settings/pricing/${item.key}/goods`);
                }}
                active={service == item.key && area == 'goods'}
              />
              <NavLink
                label="Work"
                onClick={() => {
                  router.push(`/settings/pricing/${item.key}/work`);
                }}
                active={service == item.key && area == 'work'}
              />
              <NavLink
                label="Service"
                onClick={() => {
                  router.push(`/settings/pricing/${item.key}/service`);
                }}
                active={service == item.key && area == 'service'}
              />
            </NavLink>
          );
        })}
    </SideBar>
  );
}

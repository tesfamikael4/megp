'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  Button,
  Divider,
  Table,
  Textarea,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import DeleteConfirmationModal from '@/shared/confirmation';

import * as Icon from '@tabler/icons-react';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import countryCodes from '@/shared/core/utilities/country.json';
import { Select, Card } from '@mantine/core';
import { useLazyGetOrganizationsAdmimQuery } from '@/store/api/organization/organization.api';

import { EmptyIcon } from '@/shared/ui/page';
import EmptyState from '@/shared/ui/empty';

/* Form schema */

/* Component props type */

/* Component definition */
const OrgAdminList = () => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  /* Component states */

  const [
    trigger,
    { data: organizationAdmin, isSuccess: isFetchedOrganizationSuccess },
  ] = useLazyGetOrganizationsAdmimQuery();

  useEffect(() => {
    trigger(true);
  }, [trigger]);

  // /*  */

  return (
    <>
      <Table className="my-4">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th className="">email</th>
            <th className="w-1">Action</th>
          </tr>
        </thead>
        <tbody className="border-b">
          {organizationAdmin?.item?.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.shortName}</td>

              <td className="flex justify-end">
                <Button
                  size="xs"
                  color={'red'}
                  type="button"
                  className="bg-danger p-1"
                >
                  {<Icon.IconEye className="flex" size={16} />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {(organizationAdmin?.item?.length == 0 ||
        organizationAdmin == undefined) && <EmptyState />}
    </>
  );
};

export default OrgAdminList;

import classes from './sidebar.module.scss';
import { Box, Table } from '@mantine/core';

import React from 'react';
import { GeneratePdf } from '@megp/core-fe';
import { useGetVendorQuery } from '@/store/api/vendor_request_handler/new_registration_query';
import FormPreview from '@/shared/review/review';

interface Tracker {
  action: string;
  remark: string;
  handlerName: string;
  updatedAt: Date;
  executedAt: Date;
  applicationNumber: string;
  createdAt: Date;
  data: {
    id: string;
    createdAt: Date;
    submittedAt: Date;
    service: {
      name: string;
    };

    name: string;
    country: string;
    metaData: {
      addressInformation: {
        primaryEmail: string;
        postalAddress: string;
        alternateEmail: string;
        telephone: string;
        mobilePhone: string;
        fax: string;
        website: string;
      };
      businessSizeAndOwnership: {
        numberOfEmployees: number;
        ownershipType: string;
        paidUpCapital: number;
        registeredCapital: number;
        mobilePhone: string;
        fax: string;
        website: string;
      };
      bankAccountDetails: {
        bankAccountDetailsTable: {
          accountHoldersFullName: string;
          accountNumber: number;
          bankSWIFT_BICCode: number;
          bankBranchAddress: string;
          bankName: string;
          currency: number;
        }[];
      };
      contactPersons: {
        contactPersonsTable: {
          firstName: string;
          lastName: string;
          email: string;
          mobileNumber: string;
        }[];
      };
    };
  };
  service: {
    name: string;
  };
  task: {
    taskType: string;
  };
  attachments: any[];
}

export function TasksDetailsPage(props: { tracker: Tracker }) {
  const { tracker } = props;

  const getVendorInfo = useGetVendorQuery({
    id: tracker.data?.id,
  });

  if (tracker.task.taskType === 'ISR') {
    return (
      <Box className="p-3">
        {getVendorInfo.data && <FormPreview data={getVendorInfo.data} />}
      </Box>
    );
  } else if (tracker.task.taskType === 'Approval') {
    return (
      <Box className={classes.reviewResult}>
        <Table className="min-w-full bg-white">
          <Box></Box>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td className={classes.tablecell}>Action Taken</Table.Td>
              <Table.Td className={classes.tablecell}>
                {tracker.action || ''}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className={classes.tablecell}>Remark</Table.Td>
              <Table.Td className={classes.tablecell}>
                {tracker.remark || ''}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className={classes.tablecell}>Executed By</Table.Td>
              <Table.Td className={classes.tablecell}>
                {tracker.handlerName || ''}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className={classes.tablecell}>Executed Time</Table.Td>
              <Table.Td className={classes.tablecell}>
                {tracker.executedAt
                  ? new Date(tracker.executedAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : ''}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    );
  } else if (tracker.task.taskType === 'Confirmation') {
    return (
      <Box className={classes.reviewResult}>
        <Table className="min-w-full bg-white">
          <Table.Tbody>
            <Table.Tr>
              <Table.Td className={classes.tablecell}>Action Taken</Table.Td>
              <Table.Td className={classes.tablecell}>
                {tracker.action || ''}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className={classes.tablecell}>Remark</Table.Td>
              <Table.Td className={classes.tablecell}>
                {tracker.remark || ''}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className={classes.tablecell}>Executed By</Table.Td>
              <Table.Td className={classes.tablecell}>
                {tracker.handlerName || ''}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className={classes.tablecell}>Executed Time</Table.Td>
              <Table.Td className={classes.tablecell}>
                {tracker.executedAt
                  ? new Date(tracker.executedAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : ''}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    );
  } else if (tracker.task.taskType === 'Invoice') {
    return <div>Invoice</div>;
  } else if (tracker.task.taskType === 'Payment') {
    return <div>Payment</div>;
  } else if (tracker.task.taskType === 'Certificate') {
    return (
      <Box>
        <GeneratePdf
          label="Cerficate"
          selector="#qr"
          templateUrl="http://192.168.137.22:5500/verify/vendors/544544212"
          className=""
          mode="view"
          apiUrl="http://192.168.1.27:3000/api/"
        />
      </Box>
    );
  } else {
    return <div>Unknown task type</div>;
  }
}

'use client';

import { useGetAllVendorRequestsQuery } from '@/store/api/vendor_request_handler/new_registration_query';
import { Avatar, Box, Loader, Table, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import styles from './requests.module.scss';

import OperationIcon from '../vendor-request-detail/_shared/icons/Operation';
import TimeIcon from '../vendor-request-detail/_shared/icons/Time';
import { Text } from '@mantine/core';
import TicketIcon from '../vendor-request-detail/_shared/icons/Ticket';
import ActivityAuditIcon from '../vendor-request-detail/_shared/icons/ActivityAudit';

export default function RequestsPage() {
  const response = useGetAllVendorRequestsQuery({
    serviceKey: 'new',
  });

  const router = useRouter();
  const handleRowClick = (instanceId) => {
    router.push(`/new-registration/vendor-request-detail/${instanceId}`);
  };

  return (
    <Section
      title="New Request Handling"
      collapsible={false}
      className={styles.supplier_body}
    >
      <Table>
        {response.data ? (
          <Table.Tbody>
            {response.data.items.map((item, index) => (
              <Table.Tr
                key={index}
                onClick={() => handleRowClick(item.id)}
                style={{ cursor: 'pointer' }}
                className={styles['table-row']}
              >
                <Table.Td className={styles.tableborder}>
                  <Box className={styles.rowWrapper}>
                    <Box className="flex items-center">
                      <Text component="strong">
                        <Avatar color="cyan" radius="xl" size="lg">
                          {item.vendor?.name.charAt(0)}
                        </Avatar>
                      </Text>
                    </Box>

                    <Box className={styles.taskDetail}>
                      <Text className={styles.taskName}>
                        Vendor: {item.vendor?.name}
                      </Text>
                      <Text> Requester: {item.vendor?.name}</Text>
                      <Text>Vendor Type: {item.vendor?.origin}</Text>
                      <Text>Task: {item.task?.name}</Text>
                    </Box>
                  </Box>
                </Table.Td>
                <Table.Td className={styles.tableborder}>
                  <Box className={styles.row_icons}>
                    <Tooltip label="Tracking number">
                      <Box>
                        <TicketIcon />
                      </Box>
                    </Tooltip>
                    <Box>
                      <Text>{item.applicationNumber}</Text>
                    </Box>
                  </Box>
                  <Box className={styles.row_icons}>
                    <Tooltip label="Business area">
                      <Box>
                        <ActivityAuditIcon />
                      </Box>
                    </Tooltip>
                    <Box>
                      <Text>{item.service.name}</Text>
                    </Box>
                  </Box>

                  <Box className={styles.row_icons}>
                    <Tooltip label="Status">
                      <Box>
                        <OperationIcon />
                      </Box>
                    </Tooltip>
                    <Box>
                      <Text>{item.vendor?.status}</Text>
                    </Box>
                  </Box>

                  <Box className={styles.row_icons}>
                    <Tooltip label="Executed time">
                      <Box>
                        <TimeIcon />
                      </Box>
                    </Tooltip>
                    <Box>
                      <Text>{item.submittedAt?.split('T')[0]}</Text>
                    </Box>
                  </Box>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        ) : (
          <Box>
            <Box className={styles.loader}>
              <Loader color="blue" />
            </Box>
          </Box>
        )}
      </Table>
    </Section>
  );
}

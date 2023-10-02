'use client';

import { useGetAllVendorRequestsQuery } from '@/store/api/vendor_request_handler/new_registration_query';
import { Pagination, Table, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import styles from './supplier-registration.module.scss';

export default function SupplierRegistrationPages() {
  const req = useGetAllVendorRequestsQuery({
    serviceKey: 'newRegistration',
  });

  //console.log('request id' + req.data.id);

  const router = useRouter();
  const handleRowClick = (instanceId) => {
    // console.log('Row clicked:', event.currentTarget);
    router.push(`/vendor?instanceId=${instanceId}`);
  };
  return (
    <div className={styles.supplier_body}>
      <Section title="Handle request" collapsible={false}>
        <Table>
          {req.data ? (
            <tbody>
              {req.data.items.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(item.id)}
                  style={{ cursor: 'pointer' }}
                  className={styles['table-row']}
                >
                  <th style={{ borderRight: '0.5px solid #e5e7eb' }}>
                    <span
                      className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
                    >
                      Requester: {item.vendor.name}
                      <br />
                      Supplier: {item.vendor.name}
                      <br />
                      Task: {item.taskHandler.task.name}
                      <br />
                      Vendor Type: {item.vendor.name}
                    </span>
                  </th>
                  <th>
                    <div className={styles.row_icons}>
                      <Tooltip label="Assigned user">
                        <div>{/* <AvatarIcon /> */}</div>
                      </Tooltip>
                      <div>
                        <span
                          className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
                        >
                          {/* {item.currentState} */}
                          Mike Jone
                        </span>
                      </div>
                    </div>

                    <div className={styles.row_icons}>
                      <Tooltip label="Status">
                        <div>{/* <OperationIcon /> */}</div>
                      </Tooltip>
                      <div>
                        <span
                          className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
                        >
                          {item.vendor.status}
                        </span>
                      </div>
                    </div>

                    <div className={styles.row_icons}>
                      <Tooltip label="Executed time">
                        <div>{/* <TimeIcon /> */}</div>
                      </Tooltip>
                      <div>
                        <span
                          className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
                        >
                          {item.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className={styles.row_icons}>
                      <Tooltip label="TIN number">
                        <div>
                          <span
                            className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
                          >
                            TIN
                          </span>
                        </div>
                      </Tooltip>
                      <div>
                        <span
                          className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
                        >
                          {item.vendor.tin}
                        </span>
                      </div>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>No data available</td>
              </tr>
            </tbody>
          )}
        </Table>
      </Section>

      <div className={styles.pagination}>
        <div>.</div>
        <div style={{ marginTop: '15px', paddingRight: '15px' }}>
          <Pagination total={10} />
        </div>
      </div>
    </div>
  );
}

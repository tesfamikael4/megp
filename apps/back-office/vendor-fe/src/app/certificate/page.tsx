'use client';
import { Box, Flex, Image, Text } from '@mantine/core';
import QRCode from 'react-qr-code';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { useUrl } from 'nextjs-current-url';
import header from './cbimage.png';
import signature from './signature.png';

export default function Certificate() {
  const { id } = useParams();
  const { href: currentUrl } = useUrl() ?? {};
  const data = [
    {
      label: 'Supplier Code',
      value: id,
    },
    {
      label: 'Supplier Name',
      value: 'Global Warehousing and Stock Management Limited',
    },
    {
      label: 'Postal Address',
      value: 'P.o. Box 20413,Kawale, Lilongwe 2',
    },
    {
      label: 'Supplier Location',
      value: 'Lilongwe',
    },
    {
      label: 'Website',
      value: '',
    },
    {
      label: 'Country of Establishment',
      value: 'Malawi',
    },
    {
      label: 'Goods Category',
      value: '',
    },
    {
      label: 'Services Category',
      value: 'Above MK 1 Billion',
    },
    {
      label: 'Expire Date',
      value: '23/05/2024',
    },
  ];
  return (
    <Box className={styles.page}>
      <Box m={30} className={styles.container}>
        <Image alt="header" src={header.src} />
        <Box p={20}>
          <Text className={styles.title}>Certificate of Registration</Text>
          <Text className={styles.subtitle}>
            This is to Certifiy that the following entity has been registered
            with the Public Procurement and Disposal of Assets Authority. The
            details are as follows:
          </Text>
          <table className={styles.list_table}>
            <tbody>
              {data.map((d) => (
                <tr key={d.label}>
                  <td className={styles.label}>{d.label}</td>
                  <td className={styles.separator}>:-</td>
                  <td className={styles.value}>{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Image
            alt="signature"
            className={styles.signature}
            src={signature.src}
          />

          <Text className={styles.author}>Dr. Edington Chilapondwa</Text>
          <Text className={styles.scan}>
            Validate this certifcate by scanning the following QR code.
          </Text>

          {currentUrl !== undefined && (
            <Box className={styles.qr} id="qr">
              <QRCode value={`${currentUrl}`} size={150} />
            </Box>
          )}

          <Flex className={styles.footer}>
            <Text className={styles.web}>www.ppda.mw</Text>
            <Text className={styles.ppda}>
              Promoting Accountability, Transparency, and Integrity in Public
              Procurement in Malawi
            </Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

import React from 'react';
import ReactPDF, {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
// import QRCode from 'react-qr-code';
const pathPrefix =
  process.env.NODE_ENV === 'production' ? 'apps/server/vendor-be/dist' : 'src';
const header = pathPrefix + '/assets/ppda.png';
const signature = pathPrefix + '/assets/signature.png';

import CertTable, { EligibilityTable, VendorInformationTable } from './Table';
//additional
const RegistrationCertificate = async ({
  basicInfo,
  businessClass,
  preferentials,
  qrCodeUrl,
}: {
  basicInfo: any[];
  businessClass: any[];
  preferentials: any[];
  qrCodeUrl: any;
}) => {
  return await ReactPDF.renderToStream(
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Image src={header} />
          <View style={{ padding: 15 }}>
            <Text style={styles.title}>Certificate of Registration</Text>
            <Text style={styles.subtitle}>
              This is to Certify that the following entity has been registered
              with the Public Procurement and Disposal of Assets Authority. The
              details are as follows
            </Text>
            {/* Vendor Details Table */}
            <VendorInformationTable basicInfo={basicInfo} />

            <Text style={{ paddingLeft: 14, marginTop: 3, fontSize: 12 }}>
              Registration For Public Procurement
            </Text>
            {/* Registration For Public Procurement Table */}
            <CertTable businessClasses={businessClass} />

            {preferentials.length ? (
              <Text
                style={{
                  paddingLeft: 14,
                  fontWeight: 'ultrabold',
                  fontSize: 12,
                }}
              >
                Eligibility For Preferential Treatment
              </Text>
            ) : null}

            {/* Eligibility For Preferential Treatment Table */}

            <EligibilityTable preferentials={preferentials} />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'column' }}>
                <Text style={styles.author}>Dr. Edington Chilapondwa</Text>
                <Image src={signature} style={styles.signature} />
                <Text style={{ marginTop: 7, fontSize: 8 }}>www.ppda.mw</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.verify}>
                  Verify by scanning this QR code.
                </Text>
                <Image src={qrCodeUrl} style={{ width: 80, height: 80 }} />
                {/* <QRCode value={`${currentUrl}`} size={150} /> */}
              </View>
              <Text
                style={{
                  fontSize: 8,
                  marginTop: 8,
                  width: 220,
                  paddingLeft: 80,
                }}
              >
                Promoting Accountability, Transparency, and Integrity in Public
                Procurement in Malawi
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>,
  );
};

export default RegistrationCertificate;

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 2,
    fontWeight: 'ultrabold',
  },
  subtitle: {
    textAlign: 'justify',
    lineHeight: 1.3,
    paddingLeft: 15,
    paddingRight: 15,
    color: '#333',
    fontSize: 12,
  },
  signature: {
    marginTop: 18,
    marginBottom: 5,
    width: '120px',
  },
  author: {
    marginTop: 8,
    fontFamily: 'Inter',
    textAlign: 'left',
    width: '224px',
    paddingRight: 0,
    fontSize: 9,
  },
  verify: {
    fontSize: 8,
    marginTop: 8,
  },
});

import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
const pathPrefix =
  process.env.NODE_ENV === 'production' ? 'apps/server/vendor-be/dist' : 'src';
const signatureImage = pathPrefix+'/assets/signature.png';
const headerImage = pathPrefix+'/assets/headerImage.png';

const CertificatePDF = ({ id, data, qrCodeUrl }) => {
  return ReactPDF.renderToStream(
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Image style={styles.header} src={headerImage} />
          <View style={styles.content}>
            <Text style={styles.title}>Certificate of Registration</Text>
            <Text style={styles.subtitle}>
              This is to Certify that the following entity has been registered
              with the Public Procurement and Disposal of Assets Authority. The
              details are as follows:
            </Text>
            <View style={styles.listTable}>
              {data.map((d) => (
                <View key={d.label} style={styles.listRow}>
                  <Text style={styles.label}>{d.label}</Text>
                  <Text style={styles.separator}>:-</Text>
                  <Text style={styles.value}>{d.value}</Text>
                </View>
              ))}
            </View>
            <Image style={styles.signature} src={signatureImage} />
            <Text style={styles.author}>Dr. Edington Chilapondwa</Text>
            <Text style={styles.scan}>
              Validate this certificate by scanning the following QR code.
            </Text>
            <Image style={styles.qrCode} src={qrCodeUrl} />
            <View style={styles.footer}>
              <Text style={styles.web}>www.ppda.mw</Text>
              <Text style={styles.ppda}>
                Promoting Accountability, Transparency, and Integrity in Public
                Procurement in Malawi
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 25,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  container: {
    borderWidth: 0.5,
    borderColor: '#374151',
  },
  header: {
    padding: 10,
    width: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    marginLeft: 140,
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 13,
    marginBottom: 50,
  },
  listTable: {
    width: '100%',
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  listRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    width: '35%',
    textAlign: 'right',
  },
  separator: {
    width: '10%',
    textAlign: 'center',
  },
  value: {
    width: '55%',
  },
  signature: {
    padding: 10,
    marginTop: 20,
    width: '35%',
    height: 'auto',
    alignSelf: 'center',
  },
  author: {
    marginLeft: 170,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scan: {
    fontSize: 10,
    marginLeft: 110,
    marginTop: 10,
    textAlign: 'center',
  },
  qrCode: {
    width: 120,
    height: 'auto',
    alignSelf: 'center',
    marginTop: 10,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    fontSize: 10,
  },
  web: {
    width: '40%',
  },
  ppda: {
    width: '60%',
    textAlign: 'right',
  },
});

export default CertificatePDF;

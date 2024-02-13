import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  // Image,
  StyleSheet,
  renderToFile,
  renderToBuffer,
} from '@react-pdf/renderer';
const pathPrefix =
  process.env.NODE_ENV === 'production' ? 'apps/server/vendor-be/dist' : 'src';
const signatureImage = pathPrefix + '/assets/signature.png';
const headerImage = pathPrefix + '/assets/headerImage.png';

const CertificatePDF = async ({ data }) => {
  const buffer = await renderToBuffer(
    <Document>
      <Page size="A4" style={styles.page}>
        {/* <Image src={myImg} /> */}
        <Text style={styles.title}>
          Annual Procurement Plan 2024 - Pre Budget Plan
        </Text>

        {data.map((item, index) => (
          <View style={styles.activities}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#f0f0f0',
                padding: 5,
                fontSize: 12.5,
              }}
            >
              <Text style={{ marginTop: 5 }}>{item.title}</Text>
              <View>
                {Object.keys(item.estimatedAmount).map((currency) => (
                  <Text key={currency}>
                    {currency}: {item.estimatedAmount[currency]}
                  </Text>
                ))}
              </View>
            </View>
            {/* End Title */}

            <View style={styles.activity}>
              <Text>Identification</Text>
            </View>
            <View style={styles.activityDetail}>
              <ReactPdfTable data={item.identification} config={{}} />
            </View>

            <View style={styles.activity}>
              <Text>Procurement Methods</Text>
            </View>
            <View style={styles.activityDetail}>
              <ReactPdfTable data={item.procurementMethods} config={{}} />
            </View>
            <View style={styles.footer}>
              <Text style={styles.web}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              {/* <Text style={styles.ppda}>Page {index + 1}</Text> */}
            </View>
          </View>
        ))}
      </Page>
    </Document>,
  );

  return buffer;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    maxWidth: '100%',
    height: '100vh',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  activities: {
    padding: 10,
    fontSize: 10,
  },
  // title
  activity: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 14,
    marginLeft: 20,
  },
  activityDetail: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontWeight: 'normal',
    fontSize: 8,
  },
  footer: {
    padding: 30,
    flexDirection: 'row',
    fontSize: 10,
    bottom: 0,
  },
  web: {
    width: '40%',
    fontSize: 9,
    color: 'gray',
    bottom: 0,
  },
  ppda: {
    width: '60%',
    textAlign: 'right',
    color: 'gray',
    bottom: 0,
  },
});

const ReactPdfTable = ({ data, config }: any) => {
  return (
    <View style={style.table}>
      {data.map((row: any, i: number) => (
        <View key={i} style={style.row}>
          <Text style={style.row1}>
            <Text style={style.bold}>{row.key}</Text>
          </Text>
          <Text style={style.row2}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  table: {
    width: '100%',
    backgroundColor: '#d9d9d9d9',
    padding: 8,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 5,
    paddingBottom: 5,
  },
  header: {
    borderTop: 'none',
  },
  bold: {
    fontWeight: 'bold',
  },
  // So Declarative and unDRY 👌
  row1: {
    width: '30%',
  },
  row2: {
    width: '70%',
  },
});

export default CertificatePDF;

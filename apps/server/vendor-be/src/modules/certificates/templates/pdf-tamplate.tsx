'use client';
import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
function formatKey(key) {
  const levels = {
    //basic information
    name: 'Company',
    countryOfRegistration: 'Country of Registration',
    tinNumber: 'TIN',
    tinIssuedDate: 'TIN Issued Date',
    registrationNumber: 'Registration Number',
    registrationIssuedDate: 'Registration Issued Date',
    businessType: 'Form of Business',
    //address information
    fax: 'Fax',
    region: 'Region',
    website: 'Website',
    district: 'District',
    telephone: 'Telephone',
    primaryEmail: 'Primary Email',
    postalAddress: 'Postal Address',
    alternateEmail: 'Alternate Email',
    physicalAddress: 'Physical Address',
  };
  const label = levels[key];
  if (label) return label;
  else return formatKeyForLabel(key);
}
const PdfDocumentTemplate = async (data) => {
  return await ReactPDF.renderToStream(
    <Document title="Registered Vendor">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{data?.title} </Text>
        <View style={styles.activities}>
          {/* upgrade Registration */}
          <View style={styles.activity}>
            {data?.renewals?.length ? (
              <Text> Registration Renewal Service Request </Text>
            ) : null}
          </View>
          <View style={styles.activityDetail}>
            {data?.renewals?.length ? (
              <ReactPdfTableGrid3
                config={{
                  columns: [
                    {
                      accessor: 'category',
                      title: 'Business Category',
                    },
                    {
                      accessor: 'previousPriceRange',
                      title: 'Current Price Range',
                    },
                    {
                      accessor: 'approvedAt',
                      title: 'Approved Date',
                    },
                    {
                      accessor: 'expireDate',
                      title: 'expiry Date',
                    },
                  ],
                  data: data?.renewals,
                }}
              />
            ) : null}
          </View>
          {/*  Upgrade Service */}
          <View style={styles.activity}>
            {data?.upgrades?.length ? (
              <Text style={{ marginBottom: '8px' }}>
                Registration Upgrade Service Request
              </Text>
            ) : null}
            {data?.upgrades?.length ? (
              <ReactPdfTableGrid3
                config={{
                  columns: [
                    {
                      accessor: 'category',
                      title: 'Business Category',
                    },
                    {
                      accessor: 'previousPriceRange',
                      title: 'Current Price Range',
                    },
                    {
                      accessor: 'approvedAt',
                      title: 'Approved Date',
                    },
                    {
                      accessor: 'expireDate',
                      title: 'expiry Date',
                    },
                    {
                      accessor: 'proposedPriceRange',
                      title: 'Proposed Price Range',
                    },
                  ],
                  data: data?.upgrades,
                }}
              />
            ) : null}
          </View>
          {/* request of PT */}
          <View style={styles.activity}>
            {data?.preferentialRequests?.length ? (
              <Text style={{ marginBottom: '8px' }}>
                Registration Request Preferential Service
              </Text>
            ) : null}
            {data?.preferentialRequests?.length ? (
              <ReactPdfTableGrid3
                config={{
                  columns: [
                    {
                      accessor: 'type',
                      title: 'Preferential service',
                    },
                    { accessor: 'certiNumber', title: 'certificate Number' },
                    // {
                    //   accessor: 'status',
                    //   title: 'Status',
                    // },
                  ],
                  data: data?.preferentialRequests,
                }}
              />
            ) : null}
          </View>
          {/* Basic Registration */}
          <View style={styles.activity}>
            <Text> Basic Registration</Text>
          </View>
          <View style={styles.activityDetail}>
            <ReactPdfTable
              data={Object.entries(data?.basic).map(([key, value]) => ({
                key: formatKey(key),
                value,
              }))}
              config={{}}
            />
          </View>
          {/* Address Information */}
          <View style={styles.activity}>
            <Text style={{ marginBottom: '8px' }}> Address Information </Text>
            <ReactPdfTable
              data={Object.entries(data?.address).map(([key, value]) => ({
                key: formatKey(key),
                value,
              }))}
              config={{}}
            />
          </View>
          {/* Contact Persons */}
          <View style={styles.activity}>
            <Text style={{ marginBottom: '8px' }}> Contact Persons</Text>
            <ReactPdfTableGrid3
              config={{
                columns: [
                  {
                    accessor: 'firstName',
                    title: 'First Name',
                  },
                  {
                    accessor: 'lastName',
                    title: 'Last Name',
                  },
                  {
                    accessor: 'email',
                    title: 'Email',
                  },
                  {
                    accessor: 'mobileNumber',
                    title: 'Phone Number',
                  },
                ],
                data: data?.contactPersons,
              }}
            />
          </View>
          {/* Business Size and Ownership */}
          <View style={styles.activity}>
            <Text style={{ marginBottom: '8px' }}>
              {' '}
              Business Size And Ownership
            </Text>
            <ReactPdfTable
              data={[
                // {
                //   key: 'Ownership Type',
                //   value: data?.businessSizeAndOwnership.ownershipType,
                // },

                {
                  key: 'Registered Capital',
                  value: `${data?.businessSizeAndOwnership.registeredCapital.amount} ${data?.businessSizeAndOwnership.registeredCapital.currency}`,
                },
                {
                  key: 'Paid Up Capital',
                  value: `${data?.businessSizeAndOwnership.paidUpCapital.amount} ${data?.businessSizeAndOwnership.paidUpCapital.currency}`,
                },
                {
                  key: 'Number of Employees',
                  value: data?.businessSizeAndOwnership.numberOfEmployees,
                },
              ]}
              config={{}}
            />
          </View>
          {/* Beneficial Ownership */}
          <View style={styles.activity}>
            <Text style={{ marginBottom: '8px' }}>
              Beneficial Ownership and Shareholders
            </Text>
            <ReactPdfTableGrid3
              config={{
                columns: [
                  {
                    accessor: 'firstName',
                    title: 'First Name',
                  },
                  {
                    accessor: 'middleName',
                    title: 'middle Name',
                  },
                  {
                    accessor: 'lastName',
                    title: 'Last Name',
                  },
                  {
                    accessor: 'nationality',
                    title: 'Nationality',
                  },
                  {
                    accessor: 'share',
                    title: 'Share',
                  },
                  {
                    accessor: 'countryOfResidence',
                    title: 'Country of Residence',
                  },
                  {
                    accessor: 'votingRights',
                    title: 'voting Rights',
                  },
                  {
                    accessor: 'authorityToAppointGov',
                    title: 'Authority to Appoint Govt.',
                  },
                ],
                data: data?.beneficialOwnershipShareholders,
              }}
            />
          </View>
          {/* Bank Account Details */}
          <View style={styles.activity}>
            <Text style={{ marginBottom: '8px' }}> Bank Account Details </Text>
            <ReactPdfTableGrid3
              config={{
                columns: [
                  {
                    accessor: 'bankType',
                    title: 'bankType',
                  },
                  {
                    accessor: 'accountType',
                    title: 'accountType',
                  },
                  {
                    accessor: 'accountHolderFullName',
                    title: 'Full Name',
                  },
                  { accessor: 'accountNumber', title: 'Account Number' },
                  {
                    accessor: 'bankName',
                    title: 'Bank Name',
                  },
                  {
                    accessor: 'branchName',
                    title: 'Branch Name',
                  },
                  {
                    accessor: 'branchAddress',
                    title: 'Address',
                  },
                  {
                    accessor: 'currency',
                    title: 'currency',
                  },
                  {
                    accessor: 'swiftCode',
                    title: 'swiftCode',
                  },
                  {
                    accessor: 'IBAN',
                    title: 'IBAN',
                  },
                  {
                    accessor: 'isDefualt',
                    title: 'Defualt',
                  },
                ],
                data: data?.bankAccountDetails,
              }}
            />
          </View>
          {/* Areas of Business Interest */}
          <View style={styles.activity}>
            <Text style={{ marginBottom: '8px' }}>
              {' '}
              Purpose of Registration
            </Text>
            <ReactPdfTableGrid3
              config={{
                columns: [
                  {
                    accessor: 'category',
                    title: 'Category',
                  },
                  { accessor: 'priceRange', title: 'Price Range' },
                  {
                    accessor: 'registrationNumber',
                    title: 'Registration Number',
                  },
                  {
                    accessor: 'registrationDate',
                    title: 'Registration Date',
                  },
                  {
                    accessor: 'expiryDate',
                    title: 'expiry Date',
                  },
                  {
                    accessor: 'userType',
                    title: 'User Type',
                  },
                  {
                    accessor: 'classification',
                    title: 'classification',
                  },
                ],
                data: data?.areasOfBusinessInterest,
              }}
            />
          </View>
          {/* previousBusinessInterestAreas */}
          <View style={styles.activity}>
            {data?.previousBusinessInterestAreas?.length ? (
              <Text style={{ marginBottom: '8px' }}>
                Approved Purpose of Registration
              </Text>
            ) : null}
            {data?.previousBusinessInterestAreas?.length ? (
              <ReactPdfTableGrid3
                config={{
                  columns: [
                    {
                      accessor: 'category',
                      title: 'Category',
                    },
                    { accessor: 'priceRange', title: 'Price Range' },
                  ],
                  data: data?.previousBusinessInterestAreas,
                }}
              />
            ) : null}
          </View>

          {/*Business Lines*/}
          <View style={styles.activity}>
            <Text style={{ marginBottom: '8px' }}> line of Business</Text>

            <View style={styles.activity}>
              {data?.lineOfBusiness.map((item, index) => {
                return (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.listItemText}>{item.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          {/* preferential information Documents */}
          <View style={styles.activity}>
            {data?.preferential?.length ? (
              <Text style={{ marginBottom: '8px' }}>
                Eligibility for Preferential Services
              </Text>
            ) : null}
            {data?.preferential?.length ? (
              <ReactPdfTableGrid3
                config={{
                  columns: [
                    {
                      accessor: 'type',
                      title: 'Preferential service',
                    },
                    { accessor: 'certiNumber', title: 'certificate Number' },
                    // {
                    //   accessor: 'status',
                    //   title: 'Status',
                    // },
                  ],
                  data: data?.preferential,
                }}
              />
            ) : null}
          </View>
          {/* Supporting Documents */}
          {/* Payment Reciepts */}
        </View>
      </Page>
    </Document>,
  );
};

export default PdfDocumentTemplate;
const formatKeyForLabel = (key) => {
  const words = key.split(/(?=[A-Z])/);
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join(' ');
};

const ReactPdfTable = ({ data }: any) => {
  return (
    <>
      <View style={styles.table}>
        {data?.map((row: any, i: number) => (
          <View key={i} style={styles.row}>
            <Text style={styles.row1}>
              <Text style={styles.bold}>{row.key}</Text>
            </Text>
            <Text style={styles.row2}>{row.value}</Text>
          </View>
        ))}
      </View>
    </>
  );
};
const ReactPdfTableGrid3 = ({ config }: any) => {
  return (
    <>
      <View style={styles.table}>
        <View style={styles.header}>
          {config.columns.map((col: any, i: number) => (
            <Text
              style={{
                paddingTop: 5,
                paddingBottom: 2,
                paddingHorizontal: 8,
                width: col?.width ?? '100%',
                fontSize: '7px',
                textAlign: col?.textAlign ?? 'left',
                borderRight:
                  config.columns.length - 1 == i ? 'none' : '1px solid #636e72',
              }}
              key={i}
            >
              {col.title}
            </Text>
          ))}
        </View>
        {config.data?.map((row: any, i: number) => (
          <View key={i} style={styles.row}>
            {config.columns.map((col: any, index: number) => (
              <Text
                style={{
                  paddingTop: 5,
                  paddingBottom: 2,
                  paddingHorizontal: 8,
                  width: col?.width ?? '100%',
                  fontSize: '7px',
                  textAlign: col?.textAlign ?? 'left',
                  borderRight:
                    config.columns.length - 1 == index
                      ? 'none'
                      : '1px solid #636e72',
                }}
                key={index}
              >
                {col?.render?.(row) ?? row[col.accessor]}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    maxWidth: '100%',
    paddingTop: 50,
    paddingBottom: 50,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  activities: {
    padding: 10,
    fontSize: 10,
  },
  // title
  activity: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 12,
    marginLeft: 20,
  },
  activityDetail: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontWeight: 'normal',
    fontSize: 8,
  },
  table: {
    maxWidth: '520px',
    borderRight: '1px solid  #636e72',
    borderLeft: '1px solid  #636e72',
    borderTop: '1px solid  #636e72',
  },
  header: {
    backgroundColor: 'rgb(209 213 219)',
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #636e72',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #636e72',
  },
  bold: {
    fontWeight: 'bold',
  },
  row1: {
    width: '30%',
    backgroundColor: 'rgb(209 213 219)',
    paddingRight: 10,
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 2,
    fontSize: '7px',
  },
  row2: {
    paddingTop: 5,
    paddingBottom: 2,
    paddingHorizontal: 8,
    width: '70%',
    fontSize: '7px',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    marginRight: 5,
  },
  listItemText: {
    fontSize: 12,
  },
});

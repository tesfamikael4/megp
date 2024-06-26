'use client';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';

export const rfxPdf = async ({ rfx }: any) => {
  const bidProcedureData = [
    {
      key: 'Bid Validity Period',
      value: `${rfx?.rfxBidProcedure?.bidValidityPeriod} days`,
    },
    {
      key: 'Posting Date',
      value: rfx?.rfxBidProcedure?.postingDate,
    },
    {
      key: 'Submission Deadline',
      value: rfx?.rfxBidProcedure?.submissionDeadline,
    },
    {
      key: 'Opening Date',
      value: rfx?.rfxBidProcedure?.openingDate,
    },
    {
      key: 'Percentage Quantity Change',
      value: `${rfx?.rfxBidProcedure?.deltaPercentage} %`,
    },
  ];

  const reverseData = [
    {
      key: 'Number Of Rounds',
      value: rfx?.rfxBidProcedure?.round,
    },
    {
      key: 'Minimum Bid Decrement Percentage',
      value: `${rfx?.rfxBidProcedure?.minimumBidDecrementPercentage} %`,
    },
    {
      key: 'Round Duration',
      value: `${rfx?.rfxBidProcedure?.roundDuration} mins`,
    },
  ];

  rfx?.rfxBidProcedure?.isReverseAuction &&
    reverseData?.map((reverseItem) => bidProcedureData.push(reverseItem));

  const buffer = await renderToBuffer(
    <Document title={rfx?.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{rfx?.name}</Text>
        <View style={styles.activities}>
          <View style={styles.activity}>
            <Text>RFX Detail</Text>
          </View>
          <View style={styles.activityDetail}>
            <ReactPdfTable
              data={[
                {
                  key: 'Reference No.',
                  value: rfx?.procurementReferenceNumber,
                },
                {
                  key: 'Name',
                  value: rfx?.name,
                },
                {
                  key: 'Procurment Category',
                  value: rfx?.procurementCategory,
                },
              ]}
              config={{}}
            />
          </View>
          <View style={styles.activity}>
            <Text>Procurment Mechanism</Text>
          </View>
          <View style={styles.activityDetail}>
            <ReactPdfTable
              data={[
                {
                  key: 'Procurment Type',
                  value:
                    rfx?.rfxProcurementMechanism?.PRRfxProcurementMechanisms
                      ?.procurementType,
                },
                {
                  key: 'Procurment Method',
                  value:
                    rfx?.rfxProcurementMechanism?.PRRfxProcurementMechanisms
                      ?.procurementMethod,
                },
                {
                  key: 'Funding Source',
                  value:
                    rfx?.rfxProcurementMechanism?.PRRfxProcurementMechanisms
                      ?.fundingSource,
                },
              ]}
              config={{}}
            />
          </View>

          {/* items */}
          <View style={styles.activity}>
            <Text>Items</Text>
          </View>
          {rfx?.items &&
            rfx?.items.length > 0 &&
            rfx.items.map((item, index) => {
              const technicalSpecConfig = Object.entries(
                item?.technicalRequirement?.technicalSpecification || {},
              )
                .filter(([key]) => key !== 'url')
                .map(([key, value]) => ({
                  key: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
                  value: value ?? '',
                }));
              const deliverySpecConfig = Object.entries(
                item?.technicalRequirement?.deliverySpecification || {},
              )
                .filter(([key]) => key !== 'url')
                .map(([key, value]) => ({
                  key: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
                  value: value ?? '',
                }));

              const descriptionConfig = item?.description
                ?.split('\n')
                .flatMap((desc) => {
                  const [key, value] = desc.split(':');
                  return { key, value };
                });
              return (
                <View style={styles.activity} key={item?.id}>
                  <Text style={{ fontSize: '10px' }}>Item {index + 1}</Text>
                  <ReactPdfTable data={descriptionConfig} config={{}} />

                  <Text style={{ marginVertical: '4px' }}>
                    Technical Specification
                  </Text>
                  <ReactPdfTable data={technicalSpecConfig} config={{}} />
                  <Text style={{ marginTop: '4px' }}>
                    Delivery Specification
                  </Text>
                  <ReactPdfTable data={deliverySpecConfig} config={{}} />
                </View>
              );
            })}

          <View style={styles.activity}>
            <Text>Bid Procedure</Text>
          </View>
          <View style={styles.activityDetail}>
            <ReactPdfTable data={bidProcedureData} config={{}} />
          </View>

          <View style={styles.activity}>
            <Text>Qualification Criteria</Text>
          </View>
          <View style={styles.activityDetail}>
            <ReactPdfTableGrid3
              config={{
                columns: [
                  {
                    accessor: 'documentTitle',
                  },
                  {
                    accessor: 'description',
                  },
                ],
                data: rfx?.rfxDocumentaryEvidences,
              }}
            />
          </View>
          {/* <View style={styles.activity}>
            <Text>Procurment Technical Team</Text>
          </View>
          <View style={styles.activityDetail}>
            <ReactPdfTableGrid3
              config={{
                columns: [
                  {
                    accessor: 'userName',
                  },
                ],
                data: rfx?.rfxProcurementTechnicalTeams,
              }}
            />
          </View> */}

          <View style={styles.activity}>
            <Text>Contract Conditions</Text>
          </View>
          <View style={styles.activityDetail}>
            <ReactPdfTable
              data={[
                {
                  key: 'Liquidity Damage',
                  value: `${rfx?.rfxBidContractCondition?.liquidityDamage} %`,
                },
                {
                  key: 'Liquidity Damage Limit',
                  value: `${rfx?.rfxBidContractCondition?.liquidityDamageLimit} %`,
                },
                {
                  key: 'Payment Release Period After Invoicing',
                  value: rfx?.rfxBidContractCondition?.paymentReleasePeriod,
                },
                {
                  key: 'Is partial payment allowed?',
                  value: `${rfx?.rfxBidContractCondition?.isPartialAllowed ? 'Yes' : 'No'}`,
                },
              ]}
              config={{}}
            />
          </View>
        </View>
      </Page>
    </Document>,
  );
  return buffer;
};

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  page: {
    backgroundColor: '#ffffff',
    maxWidth: '100%',
    height: '100vh',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  activities: {
    padding: 10,
    fontSize: 10,
  },
  // title
  activity: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
    marginLeft: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  activityDetail: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontWeight: 'normal',
    fontSize: 8,
  },
  table: {
    width: '100%',
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
});

const ReactPdfTable = ({ data }: any) => {
  return (
    <>
      <View style={styles.table}>
        {data?.map((row: any, i: number) => (
          <View key={i} style={styles.row}>
            <Text style={styles.row1}>
              <Text style={styles.bold}>{row.key}</Text>
            </Text>
            <Text style={styles.row2}>{`${row.value}` || ''}</Text>
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

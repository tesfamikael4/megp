'use client';
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  StyleSheet,
  renderToBuffer,
  Font,
} from '@react-pdf/renderer';

export const preReportPdf = async ({ activities }: any) => {
  const buffer = await renderToBuffer(
    <Document title={activities[0].preBudgetPlan.app.planName}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {activities[0].preBudgetPlan.app.planName}
        </Text>
        {activities.map((item, index) => (
          <View style={styles.activities} key={index}>
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
              <Text style={{ marginTop: 5 }}>{item.name}</Text>
            </View>
            {/* End Title */}

            <View style={styles.activity}>
              <Text>Activity Identification</Text>
            </View>
            <View style={styles.activityDetail}>
              <ReactPdfTable
                data={[
                  {
                    key: 'Reference',
                    value: item.procurementReference,
                  },
                  {
                    key: 'Name',
                    value: item.name,
                  },
                  {
                    key: 'Description',
                    value: item.description,
                  },
                  {
                    key: 'Estimated Amount',
                    value: parseFloat(item.estimatedAmount).toLocaleString(
                      'en-US',
                      {
                        style: 'currency',
                        currency: item.currency ?? 'MKW',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        currencyDisplay: 'code',
                      },
                    ),
                  },
                  {
                    key: 'Calculated Amount',
                    value: parseFloat(item.calculatedAmount).toLocaleString(
                      'en-US',
                      {
                        style: 'currency',
                        currency: item.currency ?? 'MKW',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        currencyDisplay: 'code',
                      },
                    ),
                  },
                  { key: 'Remark', value: item.remark },
                ]}
                config={{}}
              />
            </View>

            {item.preProcurementMechanism && (
              <View>
                <View style={styles.activity}>
                  <Text>Procurement Methods</Text>
                </View>
                {item.reasons &&
                  item.reasons.map((reason) => {
                    return (
                      <View
                        key={reason.id}
                        style={{
                          backgroundColor: '#ffe3e3',
                          padding: '10px',
                          borderRadius: '2px',
                          marginTop: '5px',
                          marginHorizontal: '20px',
                        }}
                      >
                        <Text style={{ color: 'red' }}>
                          🛈 Justification for{' '}
                          {reason.type === 'procurementMethod'
                            ? 'Procurement Method'
                            : 'Target Group'}
                        </Text>
                        <Text style={{ fontWeight: 'bold', marginTop: '6px' }}>
                          Possible Reason :
                        </Text>
                        <Text style={{ fontSize: 10, marginLeft: 10 }}>
                          {reason.reason}
                        </Text>

                        <Text style={{ fontWeight: 'bold', marginTop: '5px' }}>
                          Remark :
                        </Text>
                        <Text style={{ fontSize: 10, marginLeft: 10 }}>
                          {reason.remark}
                        </Text>
                      </View>
                    );
                  })}
                <View style={styles.activityDetail}>
                  <ReactPdfTable
                    data={[
                      {
                        key: 'Procurement Type',
                        value: item.preProcurementMechanism.procurementType,
                      },
                      {
                        key: 'Procurement Method',
                        value: item.preProcurementMechanism.procurementMethod,
                      },
                      {
                        key: 'Funding Source',
                        value: item.preProcurementMechanism.fundingSource,
                      },
                      {
                        key: 'Procurement Process',
                        value: item.preProcurementMechanism.isOnline
                          ? 'Online'
                          : 'Offline',
                      },
                      {
                        key: 'Supplier Target Group',
                        value:
                          item.preProcurementMechanism.targetGroup?.join(', '),
                      },
                      {
                        key: 'Donor',
                        value: item.preProcurementMechanism.donor?.[0] ?? '',
                      },
                    ]}
                    config={{}}
                  />
                </View>
              </View>
            )}

            {/* items */}
            {item.preBudgetPlanItems && item.preBudgetPlanItems.length > 0 && (
              <View style={styles.activity}>
                <Text style={{ marginBottom: '8px' }}>Items</Text>
                <ReactPdfTableGrid3
                  config={{
                    columns: [
                      {
                        accessor: 'description',
                        title: 'Description',
                        width: '1100px',
                      },
                      { accessor: 'quantity', title: 'Quantity' },
                      {
                        accessor: 'unitPrice',
                        title: 'Unit Price',
                        textAlign: 'right',
                        render: (record) =>
                          parseFloat(record.unitPrice).toLocaleString('en-US', {
                            style: 'currency',
                            currency: record?.currency,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            currencyDisplay: 'code',
                          }),
                      },
                    ],
                    data: item.preBudgetPlanItems,
                  }}
                />
              </View>
            )}

            {/* timeline */}
            {item.preBudgetPlanTimelines &&
              item.preBudgetPlanTimelines.length > 0 && (
                <View style={styles.activity}>
                  <Text style={{ marginBottom: '8px' }}>Timeline</Text>
                  <ReactPdfTableGrid3
                    config={{
                      columns: [
                        {
                          accessor: 'timeline',
                          title: 'Name',
                          width: '900px',
                        },
                        { accessor: 'period', title: 'Period' },
                        {
                          accessor: 'dueDate',
                          title: 'Due Date',
                          render: (record) =>
                            new Date(record.dueDate).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              },
                            ),
                        },
                      ],
                      data: item.preBudgetPlanTimelines,
                    }}
                  />
                </View>
              )}

            {/* Requisitioners */}
            {item.preBudgetRequisitioners &&
              item.preBudgetRequisitioners.length > 0 && (
                <View style={styles.activity}>
                  <Text style={{ marginBottom: '8px' }}>Requisitioners</Text>
                  <ReactPdfTableGrid3
                    config={{
                      columns: [
                        {
                          accessor: 'name',
                          title: 'Name',
                        },
                      ],
                      data: item.preBudgetRequisitioners,
                    }}
                  />
                </View>
              )}
          </View>
        ))}
      </Page>
    </Document>,
  );
  return buffer;
};

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

const styles = StyleSheet.create({
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

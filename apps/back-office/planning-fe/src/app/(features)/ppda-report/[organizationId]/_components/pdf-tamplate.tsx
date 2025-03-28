'use client';
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  StyleSheet,
} from '@react-pdf/renderer';
import { ReactPdfTable, ReactPdfTableGrid3 } from './pdf-table';

export const PdfReport = ({ activities }: any) => {
  return (
    <PDFViewer
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      <Document title="Annual Procurement Plan 2023">
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Annual Procurement Plan 2023</Text>
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

              {item.postProcurementMechanisms && (
                <View>
                  <View style={styles.activity}>
                    <Text>Procurement Methods</Text>
                  </View>
                  <View style={styles.activityDetail}>
                    <ReactPdfTable
                      data={[
                        {
                          key: 'Procurement Type',
                          value:
                            item.postProcurementMechanisms[0].procurementType,
                        },
                        {
                          key: 'Procurement Method',
                          value:
                            item.postProcurementMechanisms[0].procurementMethod,
                        },
                        {
                          key: 'Funding Source',
                          value:
                            item.postProcurementMechanisms[0].fundingSource,
                        },
                        {
                          key: 'Procurement Process',
                          value: item.postProcurementMechanisms[0].isOnline
                            ? 'Online'
                            : 'Offline',
                        },
                        {
                          key: 'Supplier Target Group',
                          value:
                            item.postProcurementMechanisms[0].targetGroup?.join(
                              ', ',
                            ),
                        },
                        {
                          key: 'Donor',
                          value:
                            item.postProcurementMechanisms[0].donor?.[0] ?? '',
                        },
                      ]}
                      config={{}}
                    />
                  </View>
                </View>
              )}

              {/* items */}
              {item.postBudgetPlanItems &&
                item.postBudgetPlanItems.length > 0 && (
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
                              parseFloat(record.unitPrice).toLocaleString(
                                'en-US',
                                {
                                  style: 'currency',
                                  currency: record?.currency,
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                  currencyDisplay: 'code',
                                },
                              ),
                          },
                        ],
                        data: item.postBudgetPlanItems,
                      }}
                    />
                  </View>
                )}

              {/* timeline */}
              {item.postBudgetPlanTimelines &&
                item.postBudgetPlanTimelines.length > 0 && (
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
                        data: item.postBudgetPlanTimelines,
                      }}
                    />
                  </View>
                )}

              {/* Requisitioners */}
              {item.postBudgetRequisitioners &&
                item.postBudgetRequisitioners.length > 0 && (
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
                        data: item.postBudgetRequisitioners,
                      }}
                    />
                  </View>
                )}
            </View>
          ))}
        </Page>
      </Document>
    </PDFViewer>
  );
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
});

'use client';

import {
  Document,
  //   PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import {
  ReactPdfTable,
  ReactPdfTableGrid3,
} from '../../opening/minute/[id]/_components/pdf-table';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export const PdfTemplate = () => {
  return (
    <>
      <PDFViewer className="w-full h-[90vh]">
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.title}>
              <Text>Technical Evaluation Result</Text>
            </View>

            <View style={styles.section}>
              <ReactPdfTable
                data={[
                  {
                    key: 'Tender Title',
                    value: 'Procurement of software equipment',
                  },
                  {
                    key: 'Tender Ref',
                    value: 'REF-12312312',
                  },
                  {
                    key: 'Lot',
                    value: 'Lot 1',
                  },
                  {
                    key: 'Envelop',
                    value: 'Single Envelope',
                  },
                  {
                    key: 'Award Type',
                    value: 'Item Based',
                  },
                  {
                    key: 'Evaluation Method',
                    value: 'Compliance',
                  },
                  {
                    key: 'Published Date',
                    value: 'Nov 28, 2021',
                  },
                  {
                    key: 'Closed Date',
                    value: 'Dec 12, 2021',
                  },
                  {
                    key: 'Opened Date',
                    value: 'Dec 15, 2021 ',
                  },
                ]}
              />
            </View>

            {/* Preliminary */}
            <View style={styles.section}>
              <Text style={styles.subtitle}>Preliminary Evaluation Result</Text>
              <ReactPdfTableGrid3
                config={{
                  columns: [
                    { accessor: 'bidderName', title: 'Name' },

                    {
                      accessor: 'passed',
                      title: 'Passed',
                      width: 100,
                      render: (record) => (record.passed ? '✅' : '❌'),
                    },
                  ],
                  data: [
                    { bidderName: 'Bidder 1231', passed: true },
                    { bidderName: 'Bidder 21312', passed: true },
                    { bidderName: 'Bidder 32423', passed: false },
                  ],
                }}
              />

              <View style={styles.bidder_detail}>
                <Text style={styles.bidder_title}>Bidder 1231</Text>
                <ReactPdfTableGrid3
                  config={{
                    columns: [
                      { accessor: 'requirement', title: 'Requirement' },

                      {
                        accessor: 'assessment',
                        title: 'Assessment',
                        width: 100,
                      },
                    ],
                    data: [
                      { requirement: 'Requirement 1', assessment: 'Comply' },
                      { requirement: 'Requirement 2', assessment: 'Comply' },
                      { requirement: 'Requirement 3', assessment: 'Comply' },
                    ],
                  }}
                />

                {/* bidder 2 */}
                <Text style={styles.bidder_title}>Bidder 21312</Text>
                <ReactPdfTableGrid3
                  config={{
                    columns: [
                      { accessor: 'requirement', title: 'Requirement' },

                      {
                        accessor: 'assessment',
                        title: 'Assessment',
                        width: 100,
                      },
                    ],
                    data: [
                      { requirement: 'Requirement 1', assessment: 'Comply' },
                      { requirement: 'Requirement 2', assessment: 'Comply' },
                      { requirement: 'Requirement 3', assessment: 'Comply' },
                    ],
                  }}
                />

                {/* bidder 3 */}
                <Text style={styles.bidder_title}>Bidder 32423</Text>
                <ReactPdfTableGrid3
                  config={{
                    columns: [
                      { accessor: 'requirement', title: 'Requirement' },

                      {
                        accessor: 'assessment',
                        title: 'Assessment',
                        width: 100,
                      },
                    ],
                    data: [
                      { requirement: 'Requirement 1', assessment: 'Comply' },
                      { requirement: 'Requirement 2', assessment: 'Comply' },
                      {
                        requirement: 'Requirement 3',
                        assessment: 'Not Comply',
                      },
                    ],
                  }}
                />
              </View>
            </View>

            {/* Qualification */}
            <View style={styles.section}>
              <Text style={styles.subtitle}>
                Technical Qualification Evaluation Result
              </Text>
              <ReactPdfTableGrid3
                config={{
                  columns: [
                    { accessor: 'bidderName', title: 'Name' },

                    {
                      accessor: 'passed',
                      title: 'Passed',
                      width: 100,
                      render: (record) => (record.passed ? '✅' : '❌'),
                    },
                  ],
                  data: [
                    { bidderName: 'Bidder 1231', passed: true },
                    { bidderName: 'Bidder 21312', passed: true },
                  ],
                }}
              />

              <View style={styles.bidder_detail}>
                <Text style={styles.bidder_title}>Bidder 1231</Text>
                <ReactPdfTableGrid3
                  config={{
                    columns: [
                      { accessor: 'requirement', title: 'Requirement' },

                      {
                        accessor: 'assessment',
                        title: 'Assessment',
                        width: 100,
                      },
                    ],
                    data: [
                      { requirement: 'Requirement 1', assessment: 'Comply' },
                      { requirement: 'Requirement 2', assessment: 'Comply' },
                      { requirement: 'Requirement 3', assessment: 'Comply' },
                    ],
                  }}
                />

                {/* bidder 2 */}
                <Text style={styles.bidder_title}>Bidder 21312</Text>
                <ReactPdfTableGrid3
                  config={{
                    columns: [
                      { accessor: 'requirement', title: 'Requirement' },

                      {
                        accessor: 'assessment',
                        title: 'Assessment',
                        width: 100,
                      },
                    ],
                    data: [
                      { requirement: 'Requirement 1', assessment: 'Comply' },
                      { requirement: 'Requirement 2', assessment: 'Comply' },
                      { requirement: 'Requirement 3', assessment: 'Comply' },
                    ],
                  }}
                />
              </View>
            </View>

            {/* Responsiveness */}
            <View style={styles.section}>
              <Text style={styles.subtitle}>
                Technical Responsiveness Evaluation Result
              </Text>
              <ReactPdfTableGrid3
                config={{
                  columns: [
                    { accessor: 'bidderName', title: 'Name' },

                    {
                      accessor: 'passed',
                      title: 'Passed',
                      width: 100,
                      render: (record) => (record.passed ? '✅' : '❌'),
                    },
                  ],
                  data: [
                    { bidderName: 'Bidder 1231', passed: true },
                    { bidderName: 'Bidder 21312', passed: true },
                  ],
                }}
              />

              <View style={styles.bidder_detail}>
                <Text style={styles.bidder_title}>Bidder 1231</Text>
                <ReactPdfTableGrid3
                  config={{
                    columns: [
                      { accessor: 'requirement', title: 'Requirement' },

                      {
                        accessor: 'assessment',
                        title: 'Assessment',
                        width: 100,
                      },
                    ],
                    data: [
                      { requirement: 'Requirement 1', assessment: 'Comply' },
                      { requirement: 'Requirement 2', assessment: 'Comply' },
                      { requirement: 'Requirement 3', assessment: 'Comply' },
                    ],
                  }}
                />

                {/* bidder 2 */}
                <Text style={styles.bidder_title}>Bidder 21312</Text>
                <ReactPdfTableGrid3
                  config={{
                    columns: [
                      { accessor: 'requirement', title: 'Requirement' },

                      {
                        accessor: 'assessment',
                        title: 'Assessment',
                        width: 100,
                      },
                    ],
                    data: [
                      { requirement: 'Requirement 1', assessment: 'Comply' },
                      { requirement: 'Requirement 2', assessment: 'Comply' },
                      { requirement: 'Requirement 3', assessment: 'Comply' },
                    ],
                  }}
                />
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
      ;
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    fontSize: '10px',
    margin: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  section: {
    paddingRight: '40px',
    marginTop: '20px',
  },
  subtitle: {
    marginBottom: '10px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bidder_detail: {
    marginLeft: '20px',
  },
  bidder_title: {
    marginTop: '20px',
    marginBottom: '10px',
    backgroundColor: 'rgb(209 213 219)',
    padding: 3,
  },
});

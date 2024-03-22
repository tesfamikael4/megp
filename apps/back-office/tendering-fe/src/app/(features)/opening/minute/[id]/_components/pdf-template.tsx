import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ReactPdfTable, ReactPdfTableGrid3 } from './pdf-table';
import { bidders, openers } from '../../../_constants/data';

// Create styles
const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    padding: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    color: 'gray',
  },
  title: {
    textAlign: 'center',
    fontSize: 15,
  },
  subTitle: {
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
  },
});

// Create Document Component
export const OpeningMinuteTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>PPDA</Text>
        <Text>Jan 01, 2024</Text>
      </View>
      <View>
        <Text style={styles.title}>Opening Report</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Basic Tender Information</Text>
        <ReactPdfTable
          data={[
            {
              key: 'Tender Title',
              value:
                'Consultancy Of Supervision ,Design And Contract Administration',
            },
            {
              key: 'Published Date',
              value: 'Nov 28, 2021',
            },
            {
              key: 'Closed Date',
              value: 'Dec 5, 2021',
            },
            {
              key: 'Opened Date',
              value: 'Dec 6,2021',
            },
          ]}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Checklists</Text>
        <ReactPdfTableGrid3
          config={{
            columns: [{ accessor: 'title', title: 'Title' }],
            data: [
              {
                title:
                  'Internal auditor as independent party have been invited to witness the bid opening ceremony.',
                status: 'checked',
              },
              {
                title:
                  'Other interested observers attended the bid opening ceremony.',
                status: 'checked',
              },
              {
                title:
                  'Registered representatives from mass media attending the bid opening ceremony',
                status: 'draft',
              },
              {
                title: 'The Bid Opening Team has opened each bid',
                status: 'draft',
              },
            ],
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Bidders</Text>
        <ReactPdfTableGrid3
          config={{
            columns: [
              { accessor: 'name', title: 'Name' },
              { accessor: 'email', title: 'Email' },
              {
                accessor: 'status',
                title: 'Key Shared',
                width: 150,
                render: (record) => '✅',
              },
              {
                accessor: 'Opened',
                title: 'Opened',
                width: 100,
                render: (record) => '✅',
              },
            ],
            data: bidders,
          }}
        />
      </View>

      {bidders.map((bidder, index) => {
        return (
          <View key={index} style={styles.section}>
            <Text style={styles.subTitle}>{bidder.name}</Text>
            <ReactPdfTableGrid3
              config={{
                columns: [
                  { accessor: 'title', title: 'Checklists' },
                  {
                    accessor: 'status',
                    title: '',
                    width: 50,
                    render: (record) =>
                      record.status === 'checked' ? '✅' : '❌',
                  },
                ],
                data: [
                  {
                    title:
                      'Internal auditor as independent party have been invited to witness the bid opening ceremony.',
                    status: 'checked',
                  },
                  {
                    title:
                      'Other interested observers attended the bid opening ceremony.',
                    status: 'checked',
                  },
                  {
                    title:
                      'Registered representatives from mass media attending the bid opening ceremony',
                    status: 'draft',
                  },
                  {
                    title: 'The Bid Opening Team has opened each bid',
                    status: 'checked',
                  },
                ],
              }}
            />
          </View>
        );
      })}

      <View style={styles.section}>
        <Text style={styles.subTitle}>Openers</Text>
        <ReactPdfTableGrid3
          config={{
            columns: [
              { accessor: 'name', title: 'Name' },
              { accessor: 'email', title: 'Email' },
            ],
            data: openers,
          }}
        />
      </View>
    </Page>
  </Document>
);

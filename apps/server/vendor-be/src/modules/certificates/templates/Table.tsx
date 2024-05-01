import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
const pathPrefix =
  process.env.NODE_ENV === 'production' ? 'apps/server/vendor-be/dist' : 'src';
const fonturl =
  pathPrefix +
  '/assets/fonts/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf';
const pdfStyles = StyleSheet.create({
  section: {
    margin: 8,
    padding: 8,
    flexGrow: 1,
    width: '100%',
    color: 'gray',
  },
  cell: {
    borderColor: 'gray',
    flex: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 6,
  },
  label: {
    width: '50%',
    textAlign: 'right',
  },
  separator: {
    width: 30,
    textAlign: 'center',
  },
  value: {
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const VendorInformationTable = ({ basicInfo }: { basicInfo: any[] }) => (
  <View style={{ padding: 15, fontSize: 11 }}>
    {basicInfo.map((row, index) => (
      <View
        key={index}
        style={{
          color: '#333',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Text style={pdfStyles.label}>{row.label}</Text>
        <Text style={pdfStyles.separator}>:</Text>
        <Text style={pdfStyles.value}>{row.value}</Text>
      </View>
    ))}
  </View>
);

Font.register({
  family: 'Inter',
  fonts: [{ src: fonturl }],
});

const CertTable = ({ businessClasses }: { businessClasses: any[] }) => (
  <View style={[pdfStyles.section]}>
    <View
      style={{
        flexDirection: 'row',
        fontFamily: 'Inter',
        borderColor: 'gray',
        borderWidth: 1,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomWidth: 0,
        color: '#333',
      }}
    >
      <Text
        style={[pdfStyles.cell, { borderLeftWidth: 0, borderRightWidth: 0 }]}
      >
        Category
      </Text>
      <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>Price Range</Text>
      <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>Issue Date</Text>
      <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>Expiry Date</Text>
    </View>
    {businessClasses.map((row, index) => (
      <View key={index} style={{ flexDirection: 'row' }}>
        <Text
          style={[
            pdfStyles.cell,
            { borderRightWidth: 0, fontFamily: 'Inter', color: '#333' },
          ]}
        >
          {row.Category}
        </Text>
        <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>
          {row.PriceRange}
        </Text>
        <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>
          {row.IssueDate}
        </Text>
        <Text style={[pdfStyles.cell]}>{row.ExpiryDate}</Text>
      </View>
    ))}
  </View>
);

const EligibilityTable = ({ preferentials }: { preferentials: any[] }) => (
  <View style={[pdfStyles.section]}>
    {preferentials.length ? (
      <View
        style={{
          flexDirection: 'row',
          fontFamily: 'Inter',
          borderColor: 'gray',
          borderWidth: 1,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          borderBottomWidth: 0,
          color: '#333',
        }}
      >
        <Text
          style={[pdfStyles.cell, { borderLeftWidth: 0, borderRightWidth: 0 }]}
        >
          Category
        </Text>
        <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>
          Issue Date
        </Text>
        <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>
          Expiry Date
        </Text>
      </View>
    ) : null}

    {/* <View
      style={{
        flexDirection: 'row',
        fontFamily: 'Inter',
        borderColor: 'gray',
        borderWidth: 1,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomWidth: 0,
        color: '#333',
      }}
    >
      <Text
        style={[pdfStyles.cell, { borderLeftWidth: 0, borderRightWidth: 0 }]}
      >
        Category
      </Text>
      <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>Issue Date</Text>
      <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>Expiry Date</Text>
    </View> */}

    {preferentials.map((row, index) => (
      <View key={index} style={{ flexDirection: 'row' }}>
        <Text
          style={[
            pdfStyles.cell,
            { borderRightWidth: 0, fontFamily: 'Inter', color: '#333' },
          ]}
        >
          {row.Category}
        </Text>
        <Text style={[pdfStyles.cell, { borderRightWidth: 0 }]}>
          {row.IssueDate}
        </Text>
        <Text style={[pdfStyles.cell]}>{row.ExpiryDate}</Text>
      </View>
    ))}
  </View>
);

export { EligibilityTable, VendorInformationTable };
export default CertTable;
